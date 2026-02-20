import messageService from '../../src/services/messageService';
import { AppDataSource } from '../../src/config/data-source';

jest.mock('../../src/config/data-source', () => ({
    AppDataSource: { getRepository: jest.fn() }
}));

describe('messageService.create & remove', () => {
    let repoMock: any;

    beforeEach(() => {
        repoMock = {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn()
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(repoMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('creates a message and returns saved entity', async () => {
        const inputText = 'hello';
        const created = { message_text: inputText };
        const saved = { id: 1, message_text: inputText };

        repoMock.create.mockReturnValue(created);
        repoMock.save.mockResolvedValue(saved);

        const result = await messageService.create(inputText);

        expect(repoMock.create).toHaveBeenCalledWith({ message_text: inputText });
        expect(repoMock.save).toHaveBeenCalledWith(created);
        expect(result).toEqual(saved);
    });

    it('removes existing message and returns true', async () => {
        const existing = { id: 2, message_text: 'to-delete' };
        repoMock.findOneBy.mockResolvedValue(existing);
        repoMock.remove.mockResolvedValue(undefined);

        const res = await messageService.remove(2);

        expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 2 });
        expect(repoMock.remove).toHaveBeenCalledWith(existing);
        expect(res).toBe(true);
    });

    it('remove returns false when not found', async () => {
        repoMock.findOneBy.mockResolvedValue(null);

        const res = await messageService.remove(99);

        expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 99 });
        expect(res).toBe(false);
        expect(repoMock.remove).not.toHaveBeenCalled();
    });
});
