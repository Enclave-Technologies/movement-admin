import { get_logged_in_user } from "@/actions/logged_in_user_actions";
// import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { MOVEMENT_SESSION_NAME } from "./constants";

/**
 * Checks if the current user is a Guest and not approved by admin.
 * If so, redirects them to the awaiting approval page.
 * This function should be called at the beginning of each protected page.
 */
export async function checkGuestApproval() {
    const user = await get_logged_in_user();

    if (!user) {
        // (await cookies()).delete(MOVEMENT_SESSION_NAME);
        // User is not logged in, redirect to login page
        redirect("/login");
    }

    // Check if user is a Guest and not approved by admin
    if (user.role === "Guest" && !user.approvedByAdmin) {
        redirect("/awaiting-approval");
    }

    return user;
}
