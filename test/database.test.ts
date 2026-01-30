import { initializeDatabase } from '../src/config/database';
import { DataSource } from 'typeorm';

describe('Database Connection', () => {
    it('should connect to the database successfully', async () => {
        const dataSource = await initializeDatabase();
        expect(dataSource.isInitialized).toBe(true);
    });
});

describe('Database Connection Failure', () => {
    it('should throw an error if connection fails', async () => {
        const badDataSource = new DataSource({
            type: 'postgres',
            host: 'invalid_host', // invalid host to simulate failure
            port: 5432,
            username: 'invalid_user',
            password: 'invalid_pass',
            database: 'invalid_db',
            entities: [],
            synchronize: false,
        });
        await expect(badDataSource.initialize()).rejects.toThrow();
    }, 15000); // timeout
});
