import { sql } from "drizzle-orm";
import { getDb } from "@/db/xata";

export default async function Home() {
    // Wrap database operations in a try-catch block to handle connection errors
    let result;
    try {
        const db = getDb();
        result = await db.execute(sql`SELECT current_database() as db_name`);
    } catch (error) {
        console.error("Database connection error:", error);
        result = { error: "Failed to connect to database" };
    }

    return (
        <div className="">
            <main className="">
                <h1>GymFlow</h1>
                <p>{JSON.stringify(result, null, 2)}</p>
            </main>
            <footer className=""></footer>
        </div>
    );
}
