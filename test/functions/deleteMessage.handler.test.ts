import { DeleteMessage } from '../../src/functions/DeleteMessage';

jest.mock('../../src/services/messageService', () => ({
    __esModule: true,
    default: { remove: jest.fn() }
}));

jest.mock('../../src/config/database', () => ({
    initializeDatabase: jest.fn()
}));

import messageService from '../../src/services/messageService';

describe('DeleteMessage handler', () => {
    afterEach(() => jest.resetAllMocks());

    it('returns 200 when delete succeeds', async () => {
        (messageService.remove as jest.Mock).mockResolvedValue(true);

        const req: any = { params: { id: '2' } };
        const ctx: any = { log: { info: jest.fn(), error: jest.fn() } };

        const res = await DeleteMessage(req, ctx);

        expect(res.status).toBe(200);
        expect(res.jsonBody).toHaveProperty('message');
    });

    it('returns 404 when not found', async () => {
        (messageService.remove as jest.Mock).mockResolvedValue(false);

        const req: any = { params: { id: '123' } };
        const ctx: any = { log: { info: jest.fn(), error: jest.fn() } };

        const res = await DeleteMessage(req, ctx);

        expect(res.status).toBe(404);
    });
});
