import { AppDataSource } from "./data-source";

let isInitialized = false;


export async function initializeDatabase() {
    if (!isInitialized) {
        try {
            await AppDataSource.initialize();
            isInitialized = true;
            console.log("Database connection established");
        } catch (error) {
            console.error("Failed to establish database connection:", error);
            throw new Error("Could not connect to the database. Please check your configuration and database server.");
        }
    }
    return AppDataSource;
}

export { AppDataSource };