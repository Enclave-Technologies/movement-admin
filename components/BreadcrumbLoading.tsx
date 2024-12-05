import React from "react";

const BreadcrumbLoading = () => {
  return (
    <nav className="flex p-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li>
          <div className="flex items-center text-gray-700">
            <div className="w-10 h-10 mr-2 rounded-full animate-pulse bg-gray-300"></div>
            <div className="w-20 h-4 animate-pulse bg-gray-300 rounded"></div>
          </div>
        </li>
        {[...Array(2)].map((_, index) => (
          <li key={index} className="flex items-center">
            <div className="w-4 h-4 mx-2 animate-pulse bg-gray-300"></div>
            <div className="w-24 h-4 animate-pulse bg-gray-300 rounded"></div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbLoading;
