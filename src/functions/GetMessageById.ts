import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import { Message } from "../entities/Message";

export async function GetMessageById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('GetMessageById function processing request.');

    try {
        // Extract the ID from the URL
        const id = parseInt(request.params.id, 10);

        // Validate if the ID is a valid number
        if (isNaN(id)) {
            return {
                status: 400,
                jsonBody: { error: 'Invalid ID format. ID must be a number.' }
            };
        }

        // Initialize database connection
        const dataSource = await initializeDatabase();
        const messageRepository = dataSource.getRepository(Message);

        // Check if the table is empty
        const totalMessages = await messageRepository.count();
        if (totalMessages === 0) {
            return {
                status: 200,
                jsonBody: { message: 'No messages found in the database.' }
            };
        }

        // Find the message by ID
        const message = await messageRepository.findOneBy({ id });

        // Check if the message exists
        if (!message) {
            return {
                status: 404,
                jsonBody: { error: `Message with ID ${id} not found.` }
            };
        }

        return {
            status: 200,
            jsonBody: message
        };
    } catch (error) {
        context.error('Error fetching message:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch message' }
        };
    }
}

app.http('GetMessageById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'messages/{id}',
    handler: GetMessageById
});