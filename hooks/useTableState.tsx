// hooks/useTableState.ts
import { useState } from "react";
import { SortingState, OnChangeFn } from "@tanstack/react-table";

const useTableState = () => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        setSorting(updater);
    };

    return { sorting, handleSortingChange };
};

export default useTableState;
