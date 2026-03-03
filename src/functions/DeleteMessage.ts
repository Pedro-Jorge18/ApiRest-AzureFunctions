import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import { validateId } from "../utils/validation";
import messageService from "../services/messageService";

export async function DeleteMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('DeleteMessage function processing request.');

    try {
        const idRaw = request.params.id;
        const idParse = validateId(idRaw);
        if (!idParse.success) {
            return { status: 400, jsonBody: { error: idParse.error.errors.map(e => e.message).join('; ') } };
        }
        const id = idParse.data;

        await initializeDatabase();

        const removed = await messageService.remove(id);
        if (!removed) {
            return { status: 404, jsonBody: { error: `Message with ID ${id} not found.` } };
        }

        context.log(`Message with ID ${id} deleted successfully.`);

        return { status: 200, jsonBody: { message: `Message with ID ${id} deleted successfully.` } };
    } catch (error) {
        context.error('Error deleting message:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to delete message' }
        };
    }
}

app.http('DeleteMessage', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'messages/{id}',
    handler: DeleteMessage
});