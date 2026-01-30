import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import { Message } from "../entities/Message";

interface UpdateMessageBody {
    message_text?: string;
}

export async function UpdateMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('UpdateMessage function processing request.');

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

        // Read the request body
        const body = await request.json() as UpdateMessageBody;

        // Validate that message_text was provided
        if (body.message_text === undefined) {
            return {
                status: 400,
                jsonBody: { error: 'message must be provided.' }
            };
        }

        // Validate message_text
        if (body.message_text.trim() === '') {
            return {
                status: 400,
                jsonBody: { error: 'message cannot be empty.' }
            };
        }
        if (body.message_text.length > 255) {
            return {
                status: 400,
                jsonBody: { error: 'message cannot exceed 255 characters.' }
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

        // Update the field
        existingMessage.message_text = body.message_text.trim();

        // Save the changes
        const updatedMessage = await messageRepository.save(existingMessage);

        context.log(`Message with ID ${id} updated successfully.`);

        return {
            status: 200,
            jsonBody: updatedMessage
        };
    } catch (error) {
        context.error('Error updating message:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to update message' }
        };
    }
}

app.http('UpdateMessage', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'messages/{id}',
    handler: UpdateMessage
});