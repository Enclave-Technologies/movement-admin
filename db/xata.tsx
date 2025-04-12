import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const getXataClient = async () => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const db = drizzle(client);
    return db;
};

export default getXataClient;
// const tableName = pgTable("tableName", {
//     xata_id: text("xata_id").primaryKey(),
// });

// const record = await db
//     .select()
//     .from(tableName)
//     .where(eq(tableName.xata_id, "rec_xyz"))
//     .execute();
// console.log(record);
