import { authenticated_or_login } from "@/actions/appwrite_actions";
import { checkGuestApproval } from "@/lib/auth-utils";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { InfiniteTable } from "../example-table/infinite-table";
import { getAllCoachesPaginated } from "@/actions/coach_actions";
import { columns } from "./columns";

export default async function CoachesPage() {
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

  const initialResult = await getAllCoachesPaginated({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Coaching Team</h1>

      <Suspense fallback={<TableSkeleton />}>
        <InfiniteTable
          initialData={initialResult}
          fetchDataFn={getAllCoachesPaginated}
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
