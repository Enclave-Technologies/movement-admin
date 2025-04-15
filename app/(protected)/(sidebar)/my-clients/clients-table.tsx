"use client";

import React, { useState } from "react";
import { getClientsManagedByUserPaginated } from "@/actions/client_actions";
import ReusableInfiniteScrollTable from "@/components/ui/reusable-infinite-scroll-table";
import TableOperations from "@/components/ui/table-operations";
import { columns, Client } from "./columns";
import { SortingState } from "@tanstack/react-table";

type ClientsTableProps = {
    initialClients: Client[];
    trainerId: string;
};

export default function ClientsTable({
    initialClients,
    trainerId,
}: ClientsTableProps) {
    const [globalFilter, setGlobalFilter] = useState("");

    // Client component: handle data fetching via server action
    const fetchData = async (
        start: number,
        size: number,
        sorting?: SortingState,
        filter?: string
    ): Promise<{ data: Client[]; totalRowCount: number }> => {
        const page = Math.floor(start / size) + 1;

        // Fetch only clients managed by this trainer
        const result = await getClientsManagedByUserPaginated(
            trainerId,
            page,
            size
        );

        console.log("Fetched data:", result);

        // Calculate totalRowCount based on the API response
        let totalRowCount;

        if (result.totalCount !== undefined) {
            // If totalCount is provided, use it
            totalRowCount = result.totalCount;
        } else if (result.totalPages !== undefined) {
            // If totalPages is provided, calculate totalCount
            totalRowCount = result.totalPages * size;
        } else if (result.hasMore) {
            // If only hasMore is provided, estimate totalCount
            totalRowCount = page * size + size; // Current data + at least one more page
        } else {
            // If no pagination info is provided, use the current data length
            totalRowCount = page * size;
        }

        console.log("Calculated totalRowCount:", totalRowCount);

        // If there's a filter, apply it client-side
        let filteredData = result.clients;
        if (filter && filter.trim() !== "") {
            const lowerFilter = filter.toLowerCase();
            filteredData = result.clients.filter((client) => {
                return Object.values(client).some(
                    (value) =>
                        value &&
                        String(value).toLowerCase().includes(lowerFilter)
                );
            });
        }

        return {
            data: filteredData,
            totalRowCount: totalRowCount,
        };
    };

    const handleNewClient = () => {
        // Navigate to new client page or open modal
        console.log("Add new client");
    };

    return (
        <div className="space-y-4">
            <TableOperations
                columns={columns}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onNewClick={handleNewClient}
                showNewButton={true}
                showFilterButton={true}
                showSortButton={true}
            />
            <ReusableInfiniteScrollTable<Client, unknown>
                columns={columns}
                fetchData={fetchData}
                pageSize={10}
                initialData={initialClients}
                globalFilter={globalFilter}
                className="max-w-full"
            />
        </div>
    );
}
