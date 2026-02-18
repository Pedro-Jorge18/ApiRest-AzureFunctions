import { AppDataSource } from "../config/data-source";
import { Message } from "../entities/Message";

export const messageService = {
    async create(message_text: string) {
        const repo = AppDataSource.getRepository(Message);
        const message = repo.create({ message_text });
        return repo.save(message);
    },

    async list() {
        const repo = AppDataSource.getRepository(Message);
        return repo.find();
    },

    async findById(id: number) {
        const repo = AppDataSource.getRepository(Message);
        return repo.findOneBy({ id });
    }
,
    async update(id: number, payload: Partial<{ message_text: string }>) {
        const repo = AppDataSource.getRepository(Message);
        const existing = await repo.findOneBy({ id });
        if (!existing) return null;
        if (payload.message_text !== undefined) existing.message_text = payload.message_text;
        return repo.save(existing);
    },

    async remove(id: number) {
        const repo = AppDataSource.getRepository(Message);
        const existing = await repo.findOneBy({ id });
        if (!existing) return false;
        await repo.remove(existing);
        return true;
    }
};

export default messageService;
