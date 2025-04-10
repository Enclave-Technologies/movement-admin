import {
    createAdminClient,
    createSessionClient,
} from "@/configs/appwriteConfig";
import { SESSION_COOKIE_NAME } from "@/configs/constants";
import { cookies } from "next/headers";
import "server-only";
import { Query } from "node-appwrite";

export async function trainerDetails(id: string) {
    // createSessionClient now reads cookies internally
    // Get both account and database services from the session client
    const { account, database } = await createSessionClient();
    const { users } = await createAdminClient();

     // Verify session validity before proceeding (optional but recommended)
     try {
        await account.get(); // Use the account service to verify the session
        // console.log("[trainerDetails] Session verified."); // Removed log
     } catch (sessionError) {
        // Keep this error log
        console.error("[trainerDetails] Invalid session:", sessionError);
         // Handle invalid session appropriately, e.g., throw an error or return null/empty data
         throw new Error("Invalid session");
    }

    const trainerDocs = await database.getDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_TRAINERS,
        id
    );

    const moreInfo = await users.listMemberships(id);
    const teamNames = moreInfo.memberships.map(
        (membership) => membership.teamName
    );

    const trainerDeets: TrainerData = {
        ...trainerDocs,
        teamNames,
        auth_id: trainerDocs.auth_id,
        firstName: trainerDocs.firstName,
        lastName: trainerDocs.lastName,
        imageURL: trainerDocs.imageURL,
        jobTitle: trainerDocs.jobTitle,
        phone: trainerDocs.phone,
        email: trainerDocs.email,
        gender: trainerDocs.gender,
    };

    const { documents: clientInfo } = await database.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_USERS,
        [Query.equal("trainers", id)]
    );

    return { trainerDeets, clientInfo };
}
