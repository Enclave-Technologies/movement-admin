"use client";
import { useEffect, useRef, useState } from "react";

const useInfiniteScroll = (
    fetchNextPage: () => void,
    isFetching: boolean,
    totalFetched: number,
    totalDBRowCount: number,
    threshold: number = 500
) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollHeight, scrollTop, clientHeight } =
                containerRef.current;
            const isNearBottom =
                scrollHeight - scrollTop - clientHeight < threshold;
            setIsScrolledToBottom(isNearBottom);
        }
    };

    useEffect(() => {
        if (
            isScrolledToBottom &&
            !isFetching &&
            totalFetched < totalDBRowCount
        ) {
            fetchNextPage();
        }
    }, [
        isScrolledToBottom,
        isFetching,
        totalFetched,
        totalDBRowCount,
        fetchNextPage,
    ]);

    return containerRef;
};

export default useInfiniteScroll;
