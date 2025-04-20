import { Suspense } from "react";
import { fetchPeopleData } from "@/actions/table_actions";
import { InfiniteTable } from "./infinite-table";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryProvider } from "@/providers/query-provider";

interface SearchParams {
    sorting?: string;
    filters?: string;
    search?: string;
    pageIndex?: string;
    pageSize?: string;
}

interface ExampleTablePageProps {
    searchParams: Promise<SearchParams>;
}

export default async function PublicExampleTablePage({
    searchParams,
}: ExampleTablePageProps) {
    // Await the searchParams promise
    const resolvedParams = await searchParams;

    // Create a safe copy of searchParams with default values
    const params = {
        sorting: resolvedParams?.sorting || undefined,
        filters: resolvedParams?.filters || undefined,
        search: resolvedParams?.search || undefined,
        pageIndex: resolvedParams?.pageIndex
            ? Number(resolvedParams.pageIndex)
            : 0,
        pageSize: resolvedParams?.pageSize
            ? Number(resolvedParams.pageSize)
            : 50,
    };

    // Fetch initial data from server action
    const initialData = await fetchPeopleData(params);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Public Example Infinite Scroll Table
                </h1>
                <p className="text-muted-foreground mt-2">
                    A demonstration of an infinite scroll table with server-side
                    sorting, filtering, and search.
                </p>
            </div>

            <Suspense fallback={<TableSkeleton />}>
                <QueryProvider>
                    <InfiniteTable
                        initialData={initialData}
                        fetchDataFn={fetchPeopleData}
                    />
                </QueryProvider>
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
