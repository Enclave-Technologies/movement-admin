// hooks/useTableState.ts
import { useState } from "react";
import { SortingState, OnChangeFn } from "@tanstack/react-table";

const useTableState = () => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        setSorting(updater);
        // const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        //     setSorting(updater);
        // if (!!table.getRowModel().rows.length) {
        //     rowVirtualizer.scrollToIndex?.(0);
        // }
        // };
    };

    return { sorting, handleSortingChange };
};

export default useTableState;
