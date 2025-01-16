import React from "react";

const ScrollTableSkeleton: React.FC<ScrollTableSkeletonProps> = ({
  columnCount,
  rowCount,
}) => {
  const columns = Array.from(
    { length: columnCount },
    (_, index) => `Column ${index + 1}`
  );

  return (
    <div>
      <span className="flex text-sm text-gray-500 items-center gap-1">
        (
        <div className="inline-block animate-pulse bg-gray-500 h-4 w-64 rounded"></div>
        )
      </span>
      <div className="container h-[600px] overflow-auto relative shadow-lg rounded-lg">
        <table className="w-full bg-white overflow-x-scroll touch-action-auto">
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th
                  key={i}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold"
                >
                  {/* {column} */}
                  <div className="animate-pulse bg-gray-700 h-4 w-full rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 text-gray-700">
                    <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScrollTableSkeleton;
