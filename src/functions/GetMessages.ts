import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import { Message } from "../entities/Message";

export async function GetMessages(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('GetMessages function processing request.');

    try {
        // Initialize database connection
        const dataSource = await initializeDatabase();
        const messageRepository = dataSource.getRepository(Message);

        // Fetch all messages
        const messages = await messageRepository.find();

        context.log(`Found ${messages.length} messages.`);

        return {
            status: 200,
            jsonBody: messages
        };
    } catch (error) {
        context.error('Error fetching messages:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch messages' }
        };
    }
}

app.http('GetMessages', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'messages',
    handler: GetMessages
});