import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import messageService from "../services/messageService";
import { validateId, validateUpdateMessage } from "../utils/validation";

export async function UpdateMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('UpdateMessage (PATCH) function processing request.');

    try {
        const idRaw = request.params.id;
        const idParse = validateId(idRaw);
        if (!idParse.success) {
            return { status: 400, jsonBody: { error: idParse.error.errors.map(e => e.message).join('; ') } };
        }
        const id = idParse.data;

        const body = await request.json();
        const parsed = validateUpdateMessage(body);
        if (!parsed.success) {
            return { status: 400, jsonBody: { error: parsed.error.errors.map(e => e.message).join('; ') } };
        }

        await initializeDatabase();

        const updated = await messageService.update(id, parsed.data);
        if (!updated) {
            return { status: 404, jsonBody: { error: `Message with ID ${id} not found.` } };
        }

        context.log(`Message with ID ${id} updated successfully.`);

        return { status: 200, jsonBody: updated };
    } catch (error) {
        context.error('Error updating message:', error);
        return { status: 500, jsonBody: { error: 'Failed to update message' } };
    }
}

app.http('UpdateMessage', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'messages/{id}',
    handler: UpdateMessage
});