import React from "react";

const Pagination = ({
    totalPages,
    pageNo,
    handlePageChange,
    maxVisiblePages = 5,
}) => {
    const visiblePageRange = () => {
        const maxLeft = pageNo - Math.floor(maxVisiblePages / 2);
        const maxRight = pageNo + Math.floor(maxVisiblePages / 2);

        if (maxLeft < 1) {
            return Array.from(
                { length: Math.min(maxVisiblePages, totalPages) },
                (_, i) => i + 1
            );
        }

        if (maxRight > totalPages) {
            return Array.from(
                { length: maxVisiblePages },
                (_, i) => totalPages - maxVisiblePages + i + 1
            );
        }

        return Array.from({ length: maxVisiblePages }, (_, i) => maxLeft + i);
    };

    const renderPageButtons = () => {
        const visiblePages = visiblePageRange();

        return (
            <>
                {visiblePages[0] > 1 && (
                    <button
                        onClick={() => handlePageChange(1)}
                        className="px-4 py-2 rounded-md bg-gray-200 text-black"
                    >
                        1
                    </button>
                )}
                {visiblePages[0] > 2 && (
                    <span className="px-4 py-2 rounded-md bg-gray-200 text-black">
                        ...
                    </span>
                )}
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md ${
                            pageNo === page
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-black"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <span className="px-4 py-2 rounded-md bg-gray-200 text-black">
                        ...
                    </span>
                )}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-4 py-2 rounded-md bg-gray-200 text-black"
                    >
                        {totalPages}
                    </button>
                )}
            </>
        );
    };

    return (
        <div className="w-full flex justify-center items-center mt-4 gap-2">
            {renderPageButtons()}
        </div>
    );
};

export default Pagination;
