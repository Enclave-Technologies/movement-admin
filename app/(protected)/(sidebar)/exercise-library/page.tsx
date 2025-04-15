import React from "react";
import { checkGuestApproval } from "@/lib/auth-utils";

export default async function ExerciseLibraryPage() {
    // Check if user is a Guest and not approved
    await checkGuestApproval();

    return <div>Exercise Library Page</div>;
}
