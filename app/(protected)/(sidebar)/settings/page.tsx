import { checkGuestApproval } from "@/lib/auth-utils";
import React from "react";

const Settings = async () => {
    // Check if user is a Guest and not approved
    await checkGuestApproval();
    return <div>Settings</div>;
};

export default Settings;
