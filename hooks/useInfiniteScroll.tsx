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

    const handleScroll = debounce(() => {
        if (containerRef.current) {
            const { scrollHeight, scrollTop, clientHeight } =
                containerRef.current;
            const isNearBottom =
                scrollHeight - scrollTop - clientHeight < threshold;
            setIsScrolledToBottom(isNearBottom);
        }
    }, 200);

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
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

export default useInfiniteScroll;
