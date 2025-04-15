"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    ColumnDef,
    OnChangeFn,
    flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

interface ReusableInfiniteScrollTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    fetchData: (
        start: number,
        size: number,
        sorting?: SortingState,
        globalFilter?: string
    ) => Promise<{ data: TData[]; totalRowCount: number }>;
    pageSize?: number;
    globalFilter?: string;
    initialData?: TData[];
    className?: string;
    rowClassName?: (row: TData) => string;
    onRowClick?: (row: TData) => void;
}

const ReusableInfiniteScrollTable = <
    TData extends Record<string, unknown>,
    TValue
>({
    columns,
    fetchData,
    pageSize = 50,
    globalFilter = "",
    initialData = [],
    className = "",
    rowClassName,
    onRowClick,
}: ReusableInfiniteScrollTableProps<TData, TValue>) => {
    const [data, setData] = useState<TData[]>(initialData);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const tableContainerRef = useRef<HTMLDivElement | null>(null);

    // Fetch data function for pagination and sorting
    const loadMoreData = useCallback(async () => {
        if (isFetching || !hasMore) return;
        setIsFetching(true);
        try {
            const start = page * pageSize;
            console.log(
                `Loading more data: page ${page}, start ${start}, size ${pageSize}`
            );

            const result = await fetchData(
                start,
                pageSize,
                sorting,
                globalFilter
            );

            console.log("Load more result:", {
                newDataLength: result.data.length,
                currentDataLength: data.length,
                totalRowCount: result.totalRowCount,
            });

            // If we got no data or we've reached/exceeded the total count, there's no more data
            if (
                result.data.length === 0 ||
                data.length + result.data.length >= result.totalRowCount
            ) {
                console.log("No more data to load");
                setHasMore(false);
            } else {
                console.log("More data available");
                setHasMore(true);
            }

            // Append the new data to our existing data
            setData((prev) => [...prev, ...result.data]);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Error loading data:", error);
            setHasMore(false);
        } finally {
            setIsFetching(false);
        }
    }, [
        data.length,
        fetchData,
        globalFilter,
        hasMore,
        isFetching,
        page,
        pageSize,
        sorting,
    ]);

    // Reset data when sorting or globalFilter changes
    useEffect(() => {
        const resetAndLoad = async () => {
            setIsFetching(true);
            setHasMore(true);
            setPage(0);
            try {
                console.log("Resetting and loading initial data");
                const result = await fetchData(
                    0,
                    pageSize,
                    sorting,
                    globalFilter
                );

                console.log("Initial load result:", {
                    dataLength: result.data.length,
                    totalRowCount: result.totalRowCount,
                });

                setData(result.data);
                setPage(1);

                // Check if we have more data to load
                if (result.data.length >= result.totalRowCount) {
                    console.log("No more data available after initial load");
                    setHasMore(false);
                } else {
                    console.log("More data available after initial load");
                    setHasMore(true);
                }
            } catch (error) {
                console.error("Error loading initial data:", error);
                setHasMore(false);
            } finally {
                setIsFetching(false);
            }
        };
        resetAndLoad();
    }, [sorting, globalFilter, fetchData, pageSize]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting as OnChangeFn<SortingState>,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualSorting: true,
        manualFiltering: true,
        globalFilterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;
            // Use Record<string, unknown> type for row.original
            return Object.values(row.original).some((value) =>
                String(value)
                    .toLowerCase()
                    .includes(String(filterValue).toLowerCase())
            );
        },
    });

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 45,
        overscan: 10,
    });

    // Function to check if we need to load more data
    const checkLoadMore = useCallback(() => {
        const container = tableContainerRef.current;
        if (!container) return;

        const threshold =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;

        console.log("Checking if we need to load more data", {
            scrollHeight: container.scrollHeight,
            scrollTop: container.scrollTop,
            clientHeight: container.clientHeight,
            threshold: threshold,
            isFetching,
            hasMore,
        });

        if (threshold < 300 && !isFetching && hasMore) {
            console.log("Loading more data...");
            loadMoreData();
        }
    }, [isFetching, hasMore, loadMoreData]);

    // Infinite scroll handler
    useEffect(() => {
        const container = tableContainerRef.current;
        if (!container) return;

        // Add scroll event listener
        container.addEventListener("scroll", checkLoadMore);

        return () => container.removeEventListener("scroll", checkLoadMore);
    }, [checkLoadMore]);

    // Check if we need to load more data when the component mounts or when data changes
    useEffect(() => {
        // Use a small timeout to ensure the DOM has updated
        const timer = setTimeout(() => {
            checkLoadMore();
        }, 100);

        return () => clearTimeout(timer);
    }, [data.length, checkLoadMore]);

    const paddingTop =
        rowVirtualizer.getVirtualItems().length > 0
            ? rowVirtualizer.getVirtualItems()[0].start
            : 0;

    const paddingBottom =
        rowVirtualizer.getVirtualItems().length > 0
            ? rowVirtualizer.getTotalSize() -
              rowVirtualizer.getVirtualItems()[
                  rowVirtualizer.getVirtualItems().length - 1
              ].end
            : 0;

    return (
        <div
            ref={tableContainerRef}
            className={className + " relative overflow-auto rounded-md border"}
            style={{ height: "calc(100vh - 200px)" }}
        >
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-background z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="border-b border-border px-4 py-3 text-left font-medium text-muted-foreground"
                                >
                                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                        <button
                                            onClick={() =>
                                                header.column.toggleSorting(
                                                    header.column.getIsSorted() ===
                                                        "asc"
                                                        ? true
                                                        : false
                                                )
                                            }
                                            className="flex items-center gap-1 group"
                                        >
                                            <span className="mr-2">
                                                {
                                                    header.column.columnDef
                                                        .header as React.ReactNode
                                                }
                                            </span>
                                            <span className="text-muted-foreground">
                                                {{
                                                    asc: (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="h-4 w-4"
                                                        >
                                                            <path d="m18 15-6-6-6 6" />
                                                        </svg>
                                                    ),
                                                    desc: (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="h-4 w-4"
                                                        >
                                                            <path d="m6 9 6 6 6-6" />
                                                        </svg>
                                                    ),
                                                }[
                                                    header.column.getIsSorted() as string
                                                ] ?? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-4 w-4 opacity-0 group-hover:opacity-50"
                                                    >
                                                        <path d="m18 15-6-6-6 6" />
                                                    </svg>
                                                )}
                                            </span>
                                        </button>
                                    ) : (
                                        (header.column.columnDef
                                            .header as React.ReactNode)
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: paddingTop }} />
                        </tr>
                    )}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        const isEven = virtualRow.index % 2 === 0;
                        return (
                            <tr
                                key={row.id}
                                className={`${
                                    isEven ? "bg-muted/50" : "bg-background"
                                } hover:bg-muted transition-colors ${
                                    rowClassName
                                        ? rowClassName(row.original)
                                        : ""
                                }`}
                                onClick={() => onRowClick?.(row.original)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="border-b border-border px-4 py-3"
                                    >
                                        {/* Use flexRender from tanstack/react-table */}
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    {paddingBottom > 0 && (
                        <tr>
                            <td style={{ height: paddingBottom }} />
                        </tr>
                    )}
                    {isFetching && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-4"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                    <span className="text-muted-foreground">
                                        Loading more data...
                                    </span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReusableInfiniteScrollTable;
