import { sql } from "drizzle-orm";
import { db } from "@/db/xata";

export default async function Home() {
    const result = await db.execute(sql`SELECT current_database() as db_name`);

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
