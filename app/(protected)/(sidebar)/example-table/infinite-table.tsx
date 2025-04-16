"use client";

import * as React from "react";
import { useTableActions } from "@/hooks/use-table-actions";
import { InfiniteDataTable } from "@/components/ui/infinite-data-table";
import { TableSearch } from "@/components/ui/table-search";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { columns } from "./columns";
import { PersonApiResponse } from "@/actions/table_actions";
import { useInfiniteQuery } from "@tanstack/react-query";

interface InfiniteTableProps {
    initialData: PersonApiResponse;
    fetchDataFn: (
        params: Record<string, unknown>
    ) => Promise<PersonApiResponse>;
}

export function InfiniteTable({
    initialData,
    fetchDataFn,
}: InfiniteTableProps) {
    const {
        sorting,
        columnFilters,
        searchQuery,
        pageSize,
        handleSearchChange,
        handleLoadMore,
        resetFilters,
        urlParams,
    } = useTableActions();

    // Use React Query for data fetching with infinite scroll
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["people", urlParams],
        queryFn: async ({ pageParam = 0 }) => {
            const params = {
                ...urlParams,
                pageIndex: pageParam,
            };
            return fetchDataFn(params as Record<string, unknown>);
        },
        initialPageParam: 0,
        getNextPageParam: (
            lastPage: PersonApiResponse,
            allPages: PersonApiResponse[]
        ) => {
            const nextPage = allPages.length;
            const totalPages = Math.ceil(
                lastPage.meta.totalRowCount / pageSize
            );
            return nextPage < totalPages ? nextPage : undefined;
        },
        initialData: {
            pages: [initialData],
            pageParams: [0],
        },
    });

    // Flatten the data from all pages
    const flatData =
        data?.pages.flatMap((page: PersonApiResponse) => page.data) || [];
    const totalRowCount = data?.pages[0]?.meta.totalRowCount || 0;

    // Handle load more when the user scrolls to the bottom
    const handleInfiniteScroll = () => {
        if (hasNextPage && !isFetchingNextPage) {
            console.log("Loading more data...");
            fetchNextPage();
            // Don't call handleLoadMore() here as it updates URL params
            // which can cause a re-render and interfere with infinite scroll
        }
    };

    // Update URL after data is fetched
    React.useEffect(() => {
        if (data?.pages.length > 1) {
            // Only update URL after we've loaded more than the initial page
            handleLoadMore();
        }
    }, [data?.pages.length, handleLoadMore]);

    // Reset filters
    const handleResetFilters = () => {
        resetFilters();
    };

    // Refresh data
    const handleRefresh = () => {
        refetch();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <TableSearch
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search people..."
                    className="w-full sm:w-[300px]"
                />
                <div className="flex items-center gap-2">
                    {(sorting.length > 0 ||
                        columnFilters.length > 0 ||
                        searchQuery) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetFilters}
                            className="h-9"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear filters
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="h-9"
                        disabled={isLoading}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${
                                isLoading ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <InfiniteDataTable
                    columns={columns}
                    data={flatData}
                    loadMore={handleInfiniteScroll}
                    hasMore={!!hasNextPage}
                    isLoading={isFetchingNextPage}
                    emptyMessage={
                        columnFilters.length > 0 || searchQuery
                            ? "No results found. Try clearing your filters."
                            : "No data available."
                    }
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {flatData.length} of {totalRowCount} entries
                </div>
                {isFetchingNextPage && (
                    <div className="text-sm text-muted-foreground">
                        Loading more...
                    </div>
                )}
            </div>
        </div>
    );
}
