import { GetMessages } from '../../src/functions/GetMessages';

jest.mock('../../src/services/messageService', () => ({
    __esModule: true,
    default: { list: jest.fn() }
}));

jest.mock('../../src/config/database', () => ({
    initializeDatabase: jest.fn()
}));

import messageService from '../../src/services/messageService';

describe('GetMessages handler', () => {
    afterEach(() => jest.resetAllMocks());

    it('returns 200 and list of messages when present', async () => {
        const msgs = [{ id: 1, message_text: 'a' }, { id: 2, message_text: 'b' }];
        (messageService.list as jest.Mock).mockResolvedValue(msgs);

        const req: any = {};
        const ctx: any = { log: jest.fn(), error: jest.fn() };

        const res = await GetMessages(req, ctx);

        expect(res.status).toBe(200);
        expect(res.jsonBody).toEqual(msgs);
    });

    it('returns 200 with message when empty', async () => {
        (messageService.list as jest.Mock).mockResolvedValue([]);

        const req: any = {};
        const ctx: any = { log: jest.fn(), error: jest.fn() };

        const res = await GetMessages(req, ctx);

        expect(res.status).toBe(200);
        expect(res.jsonBody).toHaveProperty('message');
    });
});
