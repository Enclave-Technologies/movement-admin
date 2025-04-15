import { get_user_if_logged_in } from "@/actions/appwrite_actions";
import { get_logged_in_user } from "@/actions/logged_in_user_actions";
import { RegisterForm } from "@/components/auth/register-form";
import SearchParamError from "@/components/auth/search-param-error";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUp() {
    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;
    // Check if the user is already logged in
    const result = await get_user_if_logged_in(session);

    if (result) {
        try {
            // Get user with role information
            const user = await get_logged_in_user();

            // Check if user is a Guest and not approved
            if (user.role === "Guest" && !user.approvedByAdmin) {
                redirect("/awaiting-approval");
            } else {
                redirect("/my-clients");
            }
        } catch {
            // If there's an error getting the user, redirect to my-clients as fallback
            redirect("/my-clients");
        }
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="flex flex-col gap-2 w-full max-w-sm">
                <SearchParamError />
                <RegisterForm />
            </div>
        </div>
    );
}
