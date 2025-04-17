import { authenticated_or_login } from "@/actions/appwrite_actions";
import { getClientsManagedByUserPaginated } from "@/actions/client_actions";
import { checkGuestApproval } from "@/lib/auth-utils";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { InfiniteTable } from "../example-table/infinite-table";
import { columns } from "./columns";

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
  const initialResult = await getClientsManagedByUserPaginated(userId, 0, 10);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">My Clients</h1>

      <Suspense fallback={<TableSkeleton />}>
        <InfiniteTable
          initialData={initialResult}
          fetchDataFn={getClientsManagedByUserPaginated}
          columns={columns}
        />
      </Suspense>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Skeleton className="h-10 w-[300px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="h-[600px] w-full relative">
          <Skeleton className="absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
