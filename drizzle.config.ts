import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
    path: "./.env.local", // Ensure this path is correct
}); // Load environment variables from .env.local file

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schemas.ts", // Corrected path
    out: "./db/migrations",
    dbCredentials: {
        // Add your database connection details here,
        // typically loaded from environment variables
        // e.g., url: process.env.DATABASE_URL!
        url: process.env.DATABASE_URL!,
    },
    verbose: true, // Optional: Enable verbose logging for more details
    strict: true, // Optional: Enable strict mode for more checks
});
