import { get_logged_in_user } from "@/actions/logged_in_user_actions";
import { redirect } from "next/navigation";

/**
 * Checks if the current user is a Guest and not approved by admin.
 * If so, redirects them to the awaiting approval page.
 * This function should be called at the beginning of each protected page.
 */
export async function checkGuestApproval() {
    const user = await get_logged_in_user();

    // Check if user is a Guest and not approved by admin
    if (user.role === "Guest" && !user.approvedByAdmin) {
        redirect("/awaiting-approval");
    }

    return user;
}
