import { authenticated_or_login } from "@/actions/appwrite_actions";
import { getAllClientsPaginated } from "@/actions/client_actions";
import { checkGuestApproval } from "@/lib/auth-utils";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientsTable from "./clients-table";

export default async function AllClients() {
    // Check if user is a Guest and not approved
    await checkGuestApproval();

    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;

    const result = await authenticated_or_login(session);

    if (result && "error" in result) {
        console.error("Error in AllClients:", result.error);
        redirect("/login?error=user_fetch_error");
    }

    if (!result || (!("error" in result) && !result)) {
        redirect("/login");
    }

    // Initial clients data (first page)
    const initialClientsResult = await getAllClientsPaginated(0, 10);

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">All Clients</h1>

            <ClientsTable 
                initialClients={initialClientsResult.clients} 
            />
        </div>
    );
}
