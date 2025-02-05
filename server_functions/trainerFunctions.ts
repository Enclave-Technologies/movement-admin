import {
    createAdminClient,
    createSessionClient,
} from "@/configs/appwriteConfig";
import { SESSION_COOKIE_NAME } from "@/configs/constants";
import { cookies } from "next/headers";
import "server-only";
import { Query } from "node-appwrite";

export async function trainerDetails(id: string) {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);

    const { database } = await createSessionClient(
        JSON.parse(session.value).session
    );
    const { users } = await createAdminClient();

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
