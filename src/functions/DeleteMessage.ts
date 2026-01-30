import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import { Message } from "../entities/Message";

export async function DeleteMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('DeleteMessage function processing request.');

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

        // Find the existing message
        const existingMessage = await messageRepository.findOneBy({ id });

        // Check if the message exists
        if (!existingMessage) {
            return {
                status: 404,
                jsonBody: { error: `Message with ID ${id} not found.` }
            };
        }

        // Delete the message
        await messageRepository.remove(existingMessage);

        context.log(`Message with ID ${id} deleted successfully.`);

        return {
            status: 200,
            jsonBody: { message: `Message with ID ${id} deleted successfully.` }
        };
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