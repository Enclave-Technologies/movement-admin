import React, { useEffect, useMemo, useState } from "react";
import {
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    FilterFn,
} from "@tanstack/react-table";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LIMIT } from "@/configs/constants";
import {
    useFetchMoreOnBottomReached,
    globalFilterFunction,
} from "@/utils/scrollUtils";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import useTableState from "@/hooks/useTableState";
import ScrollTableSkeleton from "../pageSkeletons/scrollTableSkeleton";

const ScrollTable = ({
    setRows = (rows: any[]) => {},
    queryKey,
    columns,
    fetchData,
    dataAdded,
    dataModified,
    globalFilter,
    setGlobalFilter,
    setIsFetching = (isFetching: boolean) => {},
}) => {
    const [totalDBRowCount, setTotalDBRowCount] = useState(0);

    const { sorting, handleSortingChange } = useTableState();

    //react-query has a useInfiniteQuery hook that is perfect for this use case
    const { data, fetchNextPage, isFetching, isLoading } =
        useInfiniteQuery<ApiResponse>({
            queryKey: [
                queryKey,
                sorting, //refetch when sorting changes
                dataAdded, //refetch when new data is added
                dataModified, //refetch when data is modified
                globalFilter, //refetch when global filter changes
            ],
            queryFn: async ({ pageParam = 0 }) => {
                const start = (pageParam as number) * LIMIT;
                const fetchedData = await fetchData(start, LIMIT, sorting); // api call
                return fetchedData;
            },
            initialPageParam: 0,
            getNextPageParam: (_lastGroup, groups) => groups.length,
            refetchOnWindowFocus: false,
            placeholderData: keepPreviousData,
        });

    //flatten the array of arrays from the useInfiniteQuery hook
    const flatData = useMemo(
        () => data?.pages?.flatMap((page) => page.data) ?? [],
        [data]
    );

    useEffect(() => {
        setIsFetching(isFetching);
    }, [isFetching]);

    useEffect(() => {
        if (data?.pages?.[0]?.meta?.totalRowCount >= 0) {
            setTotalDBRowCount(data?.pages?.[0]?.meta?.totalRowCount);
        }
    }, [data]);

    // const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
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
            globalFilter,
        },
        globalFilterFn: globalFilterFunction, // Use the filter function here
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // getFilteredRowModel: getFilteredRowModel(), //client side filtering
        manualSorting: true,
        manualFiltering: true,
        debugTable: true,
    });

    // //flatten the array of arrays from the useInfiniteQuery hook
    // const flatData = useMemo(
    //   () => data?.pages?.flatMap((page) => page.data) ?? [],
    //   [data]
    // );

    // useEffect(() => {
    //   if (data?.pages?.[0]?.meta?.totalRowCount) {
    //     setTotalDBRowCount(data?.pages?.[0]?.meta?.totalRowCount);
    //   }
    // }, [data]);

    // // const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
    // const totalFetched = flatData.length;

    // //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    // const fetchMoreOnBottomReached = useFetchMoreOnBottomReached(
    //   fetchNextPage,
    //   isFetching,
    //   totalFetched,
    //   totalDBRowCount
    // );

    // const tableContainerRef = useInfiniteScroll(
    //   fetchNextPage,
    //   isFetching,
    //   totalFetched,
    //   totalDBRowCount
    // );

    // //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    // useEffect(() => {
    //   fetchMoreOnBottomReached(tableContainerRef.current);
    // }, [fetchMoreOnBottomReached]);

    // const table = useReactTable({
    //   data: flatData,
    //   columns,
    //   state: {
    //     sorting,
    //     globalFilter,
    //   },
    //   globalFilterFn: globalFilterFunction, // Use the filter function here
    //   onGlobalFilterChange: setGlobalFilter,
    //   getCoreRowModel: getCoreRowModel(),
    //   getSortedRowModel: getSortedRowModel(),
    //   getFilteredRowModel: getFilteredRowModel(), //client side filtering
    //   manualSorting: true,
    //   debugTable: true,
    // });

    //scroll to top of table when sorting changes

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

    useEffect(() => {
        setRows(rows);
    }, [setRows, rows]);

    if (isLoading) {
        return (
            <ScrollTableSkeleton
                columnCount={columns.length}
                rowCount={LIMIT}
            />
        );
    }

    const tableHeight = window.screen.height - 264 + "px";

    return (
        <div className="flex items-center justify-center">
            <div
                className={`container overflow-auto relative rounded-sm h-[${tableHeight}] w-full max-w-[1200px]`}
                onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
                ref={tableContainerRef}
            >
                <table className="table-auto bg-white overflow-x-visible touch-action-auto">
                    <TableHeader table={table} />
                    <TableBody rowVirtualizer={rowVirtualizer} rows={rows} />
                </table>
            </div>
        </div>
    );
};

export default ScrollTable;
