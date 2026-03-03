import { DataSource } from 'typeorm';

describe('Database (in-memory) Connection', () => {
    it('should initialize an in-memory sqlite database', async () => {
        const ds = new DataSource({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            entities: []
        });

        await ds.initialize();
        expect(ds.isInitialized).toBe(true);
        await ds.destroy();
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
