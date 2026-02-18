import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import messageService from "../services/messageService";
import { validateMessage } from "../utils/validation";

export async function CreateMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('CreateMessage function processing request.');

    try {
        const body = await request.json();

        const parsed = validateMessage(body);
        if (!parsed.success) {
            return { status: 400, jsonBody: { error: parsed.error.errors.map(e => e.message).join('; ') } };
        }

        await initializeDatabase();

        const savedMessage = await messageService.create(parsed.data.message_text);

        context.log(`Message created with ID: ${savedMessage.id}`);

        return { status: 201, jsonBody: savedMessage };
    } catch (error) {
        context.log.error?.('Error creating message:', error);
        return { status: 500, jsonBody: { error: 'Failed to create message' } };
    }
}

app.http('CreateMessage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'messages',
    handler: CreateMessage
});