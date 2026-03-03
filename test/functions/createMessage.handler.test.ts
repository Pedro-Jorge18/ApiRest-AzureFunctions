import { CreateMessage } from '../../src/functions/CreateMessages';

jest.mock('../../src/services/messageService', () => ({
    __esModule: true,
    default: { create: jest.fn() }
}));

jest.mock('../../src/config/database', () => ({
    initializeDatabase: jest.fn()
}));

import messageService from '../../src/services/messageService';

describe('CreateMessage handler', () => {
    const saved = { id: 5, message_text: 'hey' };

    beforeEach(() => {
        (messageService.create as jest.Mock).mockResolvedValue(saved);
    });

    afterEach(() => jest.resetAllMocks());

    it('returns 201 and saved message for valid input', async () => {
        const req: any = { json: async () => ({ message_text: 'hey' }) };
        const ctx: any = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

        const res = await CreateMessage(req, ctx);

        expect(messageService.create).toHaveBeenCalledWith('hey');
        expect(res.status).toBe(201);
        expect(res.jsonBody).toEqual(saved);
    });

    it('returns 400 for invalid input', async () => {
        const req: any = { json: async () => ({ message_text: '' }) };
        const ctx: any = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

        const res = await CreateMessage(req, ctx);

        expect(res.status).toBe(400);
        expect(res.jsonBody).toHaveProperty('error');
    });
});
