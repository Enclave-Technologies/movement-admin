// app/(protected)/client/[id]/layout.tsx
"use client";
import { UserProvider } from "@/context/ClientContext";
import { useParams } from "next/navigation";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    const params = useParams();
    // Ensure params.id is defined
    if (!params.id) {
        return <div>Error: {JSON.stringify(params)}</div>;
    }

    return <UserProvider params={params}>{children}</UserProvider>;
};

export default ClientLayout;
