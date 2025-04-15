import { getAllClientsPaginated } from "@/actions/client_actions";
import { get_logged_in_user } from "@/actions/logged_in_user_actions";
import ClientsTable from "./clients-table";

export default async function AllClientsPage() {
    // Server component: fetch initial data
    const user = await get_logged_in_user();

    if (!user) {
        return <div>Please log in to view clients</div>;
    }

    // Fetch initial page of all clients in the system
    const initialClientsData = await getAllClientsPaginated(1, 10);

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">All Clients</h1>
            <ClientsTable
                trainerId={user.id}
                initialClients={initialClientsData.clients}
                fetchAllClients={true}
            />
        </div>
    );
}
