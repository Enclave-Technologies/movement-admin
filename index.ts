import { drizzle } from "drizzle-orm/xata-http";
import getXataClient from "@/db/xata";

async function main() {
    const db = getXataClient();
}

main();
