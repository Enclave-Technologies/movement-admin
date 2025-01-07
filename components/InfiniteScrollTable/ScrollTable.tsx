import React, { useEffect } from "react";
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import { useVirtualizer } from "@tanstack/react-virtual";
import { ApiResponse } from "@/types";
import { LIMIT } from "@/configs/constants";
import { useFetchMoreOnBottomReached } from "@/utils/scrollUtils";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import useTableState from "@/hooks/useTableState";

const ScrollTable = ({ queryKey, datacount, columns, fetchData }) => {
    // const tableContainerRef = useRef(null);

    const { sorting, handleSortingChange } = useTableState();

    //react-query has a useInfiniteQuery hook that is perfect for this use case
    const { data, fetchNextPage, isFetching, isLoading } =
        useInfiniteQuery<ApiResponse>({
            queryKey: [
                queryKey,
                sorting, //refetch when sorting changes
            ],
            queryFn: async ({ pageParam = 0 }) => {
                const start = (pageParam as number) * LIMIT;
                const fetchedData = await fetchData(start, LIMIT, sorting); //pretend api call
                return fetchedData;
            },
            initialPageParam: 0,
            getNextPageParam: (_lastGroup, groups) => groups.length,
            refetchOnWindowFocus: false,
            placeholderData: keepPreviousData,
        });

    //flatten the array of arrays from the useInfiniteQuery hook
    const flatData = React.useMemo(
        () => data?.pages?.flatMap((page) => page.data) ?? [],
        [data]
    );
    const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
    const totalFetched = flatData.length;

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useFetchMoreOnBottomReached(
        fetchNextPage,
        isFetching,
        totalFetched,
        totalDBRowCount
    );

    const tableContainerRef = useInfiniteScroll(
        fetchNextPage,
        isFetching,
        totalFetched,
        totalDBRowCount
    );

    //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    const table = useReactTable({
        data: flatData,
        columns,
        state: {
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualSorting: true,
        debugTable: true,
    });

    //scroll to top of table when sorting changes
    // const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    //     setSorting(updater);
    //     if (!!table.getRowModel().rows.length) {
    //         rowVirtualizer.scrollToIndex?.(0);
    //     }
    // };

    //since this table option is derived from table row model state, we're using the table.setOptions utility
    table.setOptions((prev) => ({
        ...prev,
        onSortingChange: handleSortingChange,
    }));

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => 52, //estimate row height for accurate scrollbar dragging
        getScrollElement: () => tableContainerRef.current,
        overscan: 5,
    });

    if (isLoading) {
        return <>Loading...</>;
    }

    return (
        <div className="app">
            <span className="text-sm text-gray-500">
                ({flatData.length} of {totalDBRowCount} rows fetched)
            </span>
            <div
                className="container h-[600px] overflow-auto relative shadow-lg rounded-lg"
                onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
                ref={tableContainerRef}
            >
                <table className="w-full bg-white overflow-x-scroll">
                    <TableHeader table={table} />
                    <TableBody rowVirtualizer={rowVirtualizer} rows={rows} />
                </table>
            </div>
            {isFetching && (
                <div className="text-sm text-gray-500">Fetching More...</div>
            )}
        </div>
    );
};

export default ScrollTable;
