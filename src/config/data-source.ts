import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Message } from "../entities/Message";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // Use migrations only
    logging: true,
    entities: [Message],
    migrations: ["dist/src/migrations/*.js"],
    subscribers: [],
});