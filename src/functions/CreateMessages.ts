import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { initializeDatabase } from "../config/database";
import { Message } from "../entities/Message";

interface CreateMessageBody {
    message_text: string;
}

export async function CreateMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('CreateMessage function processing request.');

    try {
        // Read the request body
        const body = await request.json() as CreateMessageBody;

        // Validate required fields
        if (!body.message_text || body.message_text.trim() === '') {
            return {
                status: 400,
                jsonBody: { error: 'message is required and cannot be empty.' }
            };
        }

        // Validate message_text length (max 255 characters as per entity)
        if (body.message_text.length > 255) {
            return {
                status: 400,
                jsonBody: { error: 'message cannot exceed 255 characters.' }
            };
        }

        // Initialize database connection
        const dataSource = await initializeDatabase();

        const messageRepository = dataSource.getRepository(Message);

        // Create new message
        const newMessage = messageRepository.create({
            message_text: body.message_text.trim()
        });

        // Save to database
        const savedMessage = await messageRepository.save(newMessage);

        context.log(`Message created with ID: ${savedMessage.id}`);

        return {
            status: 201,
            jsonBody: savedMessage
        };
    } catch (error) {
        context.error('Error creating message:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to create message' }
        };
    }
}

app.http('CreateMessage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'messages',
    handler: CreateMessage
});