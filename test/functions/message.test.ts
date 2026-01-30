import { Message } from '../../src/entities/Message';

describe('Message Entity', () => {
    
    //Check that the entity can be instantiated
    it('should create a Message instance', () => {
        const message = new Message();
        expect(message).toBeInstanceOf(Message);
    });

    //Check that fields can be assigned
    it('should allow setting message text', () => {
        const message = new Message();
        message.message_text = 'Hello World!';
        expect(message.message_text).toBe('Hello World!');
    });

    //Check that id can be assigned
    it('should allow setting id', () => {
        const message = new Message();
        message.id = 1;
        expect(message.id).toBe(1);
    });

    //Check that dates can be assigned
    it('should allow setting dates', () => {
        const message = new Message();
        const now = new Date();
        message.created_at = now;
        message.updated_at = now;
        expect(message.created_at).toBe(now);
        expect(message.updated_at).toBe(now);
    });

});

describe('Message Validation Logic', () => {

    // Simple validation function
    function validateMessageText(text: string | undefined | null): { valid: boolean; error?: string } {
        if (!text || text.trim() === '') {
            return { valid: false, error: 'message text is required and cannot be empty.' };
        }
        if (text.length > 255) {
            return { valid: false, error: 'message cannot exceed 255 characters.' };
        }
        return { valid: true };
    }

    //Validate empty message
    it('should reject empty message', () => {
        const result = validateMessageText('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('message text is required and cannot be empty.');
    });

    //Validate null message
    it('should reject null message', () => {
        const result = validateMessageText(null);
        expect(result.valid).toBe(false);
    });

    //Validate undefined message
    it('should reject undefined message', () => {
        const result = validateMessageText(undefined);
        expect(result.valid).toBe(false);
    });

    //Validate message with only spaces
    it('should reject whitespace-only message', () => {
        const result = validateMessageText('   ');
        expect(result.valid).toBe(false);
    });

    //Validate message too long
    it('should reject message exceeding 255 characters', () => {
        const longText = 'a'.repeat(256);
        const result = validateMessageText(longText);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('message cannot exceed 255 characters.');
    });

    //Validate valid message
    it('should accept valid message', () => {
        const result = validateMessageText('Hello World!');
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    //Validate message with exactly 255 characters
    it('should accept message with exactly 255 characters', () => {
        const exactText = 'a'.repeat(255);
        const result = validateMessageText(exactText);
        expect(result.valid).toBe(true);
    });

});

describe('ID Validation Logic', () => {

    // ID validation function
    function validateId(id: string | undefined): { valid: boolean; parsedId?: number; error?: string } {
        if (!id) {
            return { valid: false, error: 'ID is required.' };
        }
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return { valid: false, error: 'Invalid ID format. ID must be a number.' };
        }
        if (parsedId <= 0) {
            return { valid: false, error: 'ID must be a positive number.' };
        }
        return { valid: true, parsedId };
    }

    //Validate valid numeric ID
    it('should accept valid numeric ID', () => {
        const result = validateId('1');
        expect(result.valid).toBe(true);
        expect(result.parsedId).toBe(1);
    });

    //Validate invalid ID (text)
    it('should reject non-numeric ID', () => {
        const result = validateId('abc');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid ID format. ID must be a number.');
    });

    //Validate undefined ID
    it('should reject undefined ID', () => {
        const result = validateId(undefined);
        expect(result.valid).toBe(false);
    });

    //Validate negative ID
    it('should reject negative ID', () => {
        const result = validateId('-1');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('ID must be a positive number.');
    });

    //Validate zero ID
    it('should reject zero ID', () => {
        const result = validateId('0');
        expect(result.valid).toBe(false);
    });

});
