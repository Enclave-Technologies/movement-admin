import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center h-full z-50 bg-gray-800/10">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <div className="absolute top-0 left-0 animate-ping rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <div className="absolute top-0 left-0 animate-pulse rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    </div>
  );
};

export default Spinner;
