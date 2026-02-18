import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import messageService from "../services/messageService";

export async function GetMessages(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('GetMessages function processing request.');

    try {
        await initializeDatabase();

        const messages = await messageService.list();

        context.log(`Found ${messages.length} messages.`);

        if (messages.length === 0) {
            return { status: 200, jsonBody: { message: 'No messages found in the database.' } };
        }

        return { status: 200, jsonBody: messages };
    } catch (error) {
        context.log.error?.('Error fetching messages:', error);
        return { status: 500, jsonBody: { error: 'Failed to fetch messages' } };
    }
}

app.http('GetMessages', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'messages',
    handler: GetMessages
});