// utils/scrollUtils.ts
import { useCallback } from "react";
import { FilterFn } from "@tanstack/react-table";

export const useFetchMoreOnBottomReached = (
    fetchNextPage: () => void,
    isFetching: boolean,
    totalFetched: number,
    totalDBRowCount: number
) => {
    return useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } =
                    containerRefElement;
                //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
                if (
                    scrollHeight - scrollTop - clientHeight < 500 &&
                    !isFetching &&
                    totalFetched < totalDBRowCount
                ) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
    );
};

export const globalFilterFunction: FilterFn<any> = (
    row,
    columnId,
    filterValue
) => {
    if (!filterValue) return true; // If filter value is empty, display all rows

    // Check if any cell in the row contains the filter value
    return Object.values(row.original).some((value) =>
        String(value).toLowerCase().includes(String(filterValue).toLowerCase())
    );
};
