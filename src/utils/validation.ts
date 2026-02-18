import { z } from "zod";

export const messageSchema = z.object({
    message_text: z.string().trim().min(1, { message: "message text is required and cannot be empty." }).max(255, { message: "message cannot exceed 255 characters." })
});

export type CreateMessageDTO = z.infer<typeof messageSchema>;

export const validateMessage = (payload: unknown) => {
    return messageSchema.safeParse(payload);
};

export const idSchema = z.string().regex(/^\d+$/, { message: 'ID must be a positive integer string.' }).transform(val => parseInt(val, 10));

export const validateId = (idValue: unknown) => {
    return idSchema.safeParse(idValue);
};

export const updateMessageSchema = z.object({
    message_text: z.string().trim().min(1, { message: "message text is required and cannot be empty." }).max(255, { message: "message cannot exceed 255 characters." }).optional()
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided for update.' });

export type UpdateMessageDTO = z.infer<typeof updateMessageSchema>;

export const validateUpdateMessage = (payload: unknown) => {
    return updateMessageSchema.safeParse(payload);
};
