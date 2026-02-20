import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import { validateId } from "../utils/validation";
import messageService from "../services/messageService";

export async function GetMessageById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('GetMessageById function processing request.');

    try {
        const idRaw = request.params.id;
        const idParse = validateId(idRaw);
        if (!idParse.success) {
            return { status: 400, jsonBody: { error: idParse.error.errors.map(e => e.message).join('; ') } };
        }
        const id = idParse.data;

        await initializeDatabase();

        const message = await messageService.findById(id);
        if (!message) {
            return { status: 404, jsonBody: { error: `Message with ID ${id} not found.` } };
        }

        return { status: 200, jsonBody: message };
    } catch (error) {
        context.error('Error fetching message:', error);
        return { status: 500, jsonBody: { error: 'Failed to fetch message' } };
    }
}

app.http('GetMessageById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'messages/{id}',
    handler: GetMessageById
});