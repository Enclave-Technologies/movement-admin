import { sql } from "drizzle-orm";
import { getDb } from "@/db/xata";
import { get_user_if_logged_in } from "@/actions/appwrite_actions";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;
    // Check if the user is already logged in
    const user = await get_user_if_logged_in(session);

    if (user) {
        redirect("/my-clients");
    }
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
