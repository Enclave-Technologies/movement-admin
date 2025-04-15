import React from "react";
import { checkGuestApproval } from "@/lib/auth-utils";

export default async function CoachesPage() {
    // Check if user is a Guest and not approved
    await checkGuestApproval();

    return <div>Coaches Page</div>;
}
