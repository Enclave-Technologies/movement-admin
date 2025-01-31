import React from "react";
import Spinner from "./Spinner";

const PageLoading = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-white text-black w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          <Spinner />
        </h2>
      </div>
    </div>
  );
};

export default PageLoading;
