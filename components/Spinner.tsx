import React from "react";

const Spinner = () => {
    return (
        <div className="flex items-center justify-center h-full z-50">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
                <div className="absolute top-0 left-0 animate-pulse rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        </div>
    );
};

export default Spinner;
