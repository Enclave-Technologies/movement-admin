import React from "react";
import { checkGuestApproval } from "@/lib/auth-utils";

export default async function Page() {
    // Check if user is a Guest and not approved
    await checkGuestApproval();
    
    return <div>All Clients Page</div>;
}
