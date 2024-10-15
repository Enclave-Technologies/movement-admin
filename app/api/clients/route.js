import { NextResponse } from "next/server";
import {
    createAdminClient,
    createSessionClient,
} from "@/configs/appwriteConfig";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/configs/constants";
import { Query } from "appwrite";

export async function GET(request) {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const tid = searchParams.get("tid");
    const lastId = searchParams.get("lastId");
    const limit = searchParams.get("limit");
    console.log(lastId);

    try {
        // Create a session client using the session cookie value
        const {
            account,
            database,
            users: sessionUsers,
        } = await createSessionClient(sessionCookie.value);

        const { account: adminAccount, users: adminUsers } =
            await createAdminClient();

        // Fetch users with trainer_id = tid
        // Build the query array
        const queries = [
            Query.equal("trainer_id", tid),
            Query.limit(parseInt(limit)),
        ];

        // Conditionally add the cursorAfter query if lastId is not empty
        if (lastId && lastId !== "undefined") {
            queries.push(Query.cursorAfter(lastId));
        }

        // Fetch users with trainer_id = tid
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_USERS,
            queries
        );
        const users = response.documents;

        const userIds = users.map((user) => user.$id);

        const fetchUserData = async (userId) => {
            const result = await adminUsers.get(userId);
            return result;
        };

        const userDataPromises = userIds.map(fetchUserData);
        const userData = await Promise.all(userDataPromises);
        console.log(userData);
        console.log("==========================");

        // Simulate the response
        return NextResponse.json(userData);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
