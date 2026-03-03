import { GetMessageById } from '../../src/functions/GetMessageById';

jest.mock('../../src/services/messageService', () => ({
    __esModule: true,
    default: { findById: jest.fn() }
}));

jest.mock('../../src/config/database', () => ({
    initializeDatabase: jest.fn()
}));

import messageService from '../../src/services/messageService';

describe('GetMessageById handler', () => {
    afterEach(() => jest.resetAllMocks());

    it('returns 200 and message when found', async () => {
        const msg = { id: 3, message_text: 'hello' };
        (messageService.findById as jest.Mock).mockResolvedValue(msg);

        const req: any = { params: { id: '3' } };
        const ctx: any = { log: jest.fn(), error: jest.fn() };

        const res = await GetMessageById(req, ctx);

        expect(res.status).toBe(200);
        expect(res.jsonBody).toEqual(msg);
    });

    it('returns 404 when not found', async () => {
        (messageService.findById as jest.Mock).mockResolvedValue(null);

        const req: any = { params: { id: '99' } };
        const ctx: any = { log: jest.fn(), error: jest.fn() };

        const res = await GetMessageById(req, ctx);

        expect(res.status).toBe(404);
    });
});
