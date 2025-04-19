"use server";
import { createSessionClient } from "@/appwrite/config";
import { redirect } from "next/navigation";
import { AppwriteException } from "appwrite";
import "server-only";
import { cookies } from "next/headers";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";

function isAppwriteException(error: unknown): error is AppwriteException {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "type" in error
    );
}

export async function authenticated_or_login(session: string | null) {
    if (session) {
        try {
            const { account } = await createSessionClient(session);
            const user = await account.get();
            return user;
        } catch (error: unknown) {
            console.error("Error fetching user account:", error);
            if (
                isAppwriteException(error) &&
                error.code === 401 &&
                error.type === "general_unauthorized_scope"
            ) {
                (await cookies()).delete(MOVEMENT_SESSION_NAME);
                redirect("/login?error=missing_account_scope");
            } else {
                (await cookies()).delete(MOVEMENT_SESSION_NAME);
                redirect("/login?error=missing_account_scope");
            }
            // return { error: error };
        }
    } else {
        (await cookies()).delete(MOVEMENT_SESSION_NAME);
        redirect("/login?error=missing_account_scope");
    }
}

export async function get_user_if_logged_in(session: string | null) {
    if (session) {
        try {
            const { account } = await createSessionClient(session);
            const user = await account.get();
            return user;
        } catch {
            return null;
        }
    } else {
        return null;
    }
}
