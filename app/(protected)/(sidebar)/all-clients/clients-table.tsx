"use client";

import { useState } from "react";
import { getAllClientsPaginated } from "@/actions/client_actions";
import { DataTable } from "@/components/ui/data-table";
import { columns, Client } from "./columns";

type ClientsTableProps = {
  initialClients: Client[];
};

export default function ClientsTable({
  initialClients,
}: ClientsTableProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // Start with page 1 since we already have page 0 (initialClients)

  const loadMoreClients = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await getAllClientsPaginated(page, 10);
      if (result.clients.length === 0) {
        setHasMore(false);
      } else {
        // Ensure we're handling the types correctly
        setClients((prev) => [...prev, ...result.clients as Client[]]);
        setPage((prev) => prev + 1);
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error("Error loading more clients:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataTable
      columns={columns}
      data={clients}
      loadMore={loadMoreClients}
      hasMore={hasMore}
      isLoading={loading}
      emptyMessage="No clients found."
    />
  );
}
