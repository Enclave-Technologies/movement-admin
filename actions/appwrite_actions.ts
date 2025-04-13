"use server";
import { createSessionClient } from "@/appwrite/config";
import { redirect } from "next/navigation";
import "server-only";

export async function authenticated_or_login(session: string | null) {
    console.log("Checking session:", session);
    if (session) {
        const { account } = await createSessionClient(session);
        try {
            const user = await account.get();
            return user;
        } catch (error) {
            console.error("Error fetching user account:", error);
            redirect("/login");
        }
    } else {
        redirect("/login");
    }
}
