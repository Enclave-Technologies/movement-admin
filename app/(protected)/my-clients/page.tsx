import { authenticated_or_login } from "@/actions/appwrite_actions";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import React from "react";

export default async function MyClients() {
    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;

    const user = await authenticated_or_login(session);
    return <div>MyClients - {JSON.stringify(user, null, 2)}</div>;
}
