import messageService from '../../src/services/messageService';
import { AppDataSource } from '../../src/config/data-source';

jest.mock('../../src/config/data-source', () => ({
    AppDataSource: { getRepository: jest.fn() }
}));

describe('messageService.update', () => {
    let repoMock: any;

    beforeEach(() => {
        repoMock = {
            findOneBy: jest.fn(),
            save: jest.fn()
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(repoMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('updates an existing message and returns the updated entity', async () => {
        const existing = { id: 1, message_text: 'old' };
        repoMock.findOneBy.mockResolvedValue(existing);
        repoMock.save.mockImplementation(async (m: any) => ({ ...m }));

        const result = await messageService.update(1, { message_text: 'new' });

        expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(repoMock.save).toHaveBeenCalled();
        expect(result).not.toBeNull();
        if (!result) {
            throw new Error('Expected updated message, got null');
        }
        expect(result.message_text).toBe('new');
    });

    it('returns null when the message does not exist', async () => {
        repoMock.findOneBy.mockResolvedValue(null);

        const result = await messageService.update(42, { message_text: 'irrelevant' });

        expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 42 });
        expect(result).toBeNull();
        expect(repoMock.save).not.toHaveBeenCalled();
    });
});
