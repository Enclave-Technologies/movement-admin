import { authenticated_or_login } from "@/actions/appwrite_actions";
import { getClientsManagedByUserPaginated } from "@/actions/client_actions";
import { checkGuestApproval } from "@/lib/auth-utils";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientsTable from "./clients-table";

export default async function MyClients() {
    // Check if user is a Guest and not approved
    await checkGuestApproval();

    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;

    const result = await authenticated_or_login(session);

    if (result && "error" in result) {
        console.error("Error in MyClients:", result.error);
        redirect("/login?error=user_fetch_error");
    }

    if (!result || (!("error" in result) && !result)) {
        redirect("/login");
    }

    // Get the user ID from the authenticated result
    const userId = result.$id; // Appwrite user ID

    // Initial clients data (first page)
    const initialClientsResult = await getClientsManagedByUserPaginated(userId, 0, 10);

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">My Clients</h1>

            <ClientsTable 
                initialClients={initialClientsResult.clients} 
                trainerId={userId} 
            />
        </div>
    );
}
