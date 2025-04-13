import { authenticated_or_login } from "@/actions/appwrite_actions";
import { LogoutButton } from "@/components/auth/logout-button";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import React from "react";
import { redirect } from "next/navigation";

export default async function MyClients() {
    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;

    const result = await authenticated_or_login(session);

    if (result && "error" in result) {
        console.error("Error in MyClients:", result.error);
        redirect("/login?error=user_fetch_error");
    }

    if (!result || (!("error" in result) && !result)) {
        redirect("/login");
    }

    return (
        <div>
            MyClients - {JSON.stringify(result, null, 2)}
            <LogoutButton />
        </div>
    );
}
