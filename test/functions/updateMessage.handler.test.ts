import { UpdateMessage } from '../../src/functions/UpdateMessages';

jest.mock('../../src/services/messageService', () => ({
    __esModule: true,
    default: { update: jest.fn() }
}));

jest.mock('../../src/config/database', () => ({
    initializeDatabase: jest.fn()
}));

import messageService from '../../src/services/messageService';

describe('UpdateMessage handler (PATCH)', () => {
    afterEach(() => jest.resetAllMocks());

    it('returns 200 when update succeeds', async () => {
        const updated = { id: 4, message_text: 'updated' };
        (messageService.update as jest.Mock).mockResolvedValue(updated);

        const req: any = { params: { id: '4' }, json: async () => ({ message_text: 'updated' }) };
        const ctx: any = { log: { info: jest.fn(), error: jest.fn() } };

        const res = await UpdateMessage(req, ctx);

        expect(res.status).toBe(200);
        expect(res.jsonBody).toEqual(updated);
    });

    it('returns 404 when update returns null', async () => {
        (messageService.update as jest.Mock).mockResolvedValue(null);

        const req: any = { params: { id: '99' }, json: async () => ({ message_text: 'x' }) };
        const ctx: any = { log: { info: jest.fn(), error: jest.fn() } };

        const res = await UpdateMessage(req, ctx);

        expect(res.status).toBe(404);
    });
});
