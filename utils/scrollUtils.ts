// utils/scrollUtils.ts
import { useCallback } from "react";

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
