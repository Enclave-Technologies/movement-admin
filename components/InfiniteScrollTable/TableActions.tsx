import { useEffect, useState } from "react";
import { TbArrowsSort, TbDownload, TbFilter, TbSearch } from "react-icons/tb";
import DebouncedInput from "../DebouncedInput";

const TableActions = ({
  columns = [],
  selectedRows = [],
  onClickNewButton,
  tableSearchQuery,
  setTableSearchQuery,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const downloadCSV = () => {
    const headers = columns.map((col) => ({
      header: col.header,
      accessorKey: col.accessorKey,
    }));
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "S.No,";
    csvContent +=
      headers
        .filter((h) => h.header !== "")
        .map((h) => h.header)
        .join(",") + "\n";
    selectedRows.forEach((row, index) => {
      csvContent += index + 1 + ",";
      csvContent += headers
        .filter((h) => h.header !== "")
        .map((h) => {
          const value = row[h.accessorKey];
          return typeof value === "string" ? `"${value}"` : value;
        })
        .join(",");
      csvContent += "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "download.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex flex-row gap-[4px] items-center">
      <div className="flex flex-row items-center">
        {/* <button className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600">
                    <TbArrowsSort />
                </button>
                <button className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600">
                    <TbFilter />
                </button> */}
        {selectedRows.length > 0 ? (
          <button
            onClick={downloadCSV}
            className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600"
          >
            <TbDownload />
          </button>
        ) : (
          <a className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-400">
            <TbDownload />
          </a>
        )}
        <div className="flex flex-row items-center">
          <button
            className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600"
            onClick={() => setIsSearchExpanded((prev) => !prev)}
          >
            <TbSearch />
          </button>
          <DebouncedInput
            value={tableSearchQuery}
            onChange={setTableSearchQuery}
            placeholder="Type to search..."
            className={`${
              isSearchExpanded ? "w-52" : "w-0"
            } bg-transparent focus:outline-none transition-all duration-300 ease-in-out outline-none`}
          />
        </div>
      </div>
      <button
        onClick={onClickNewButton}
        className="bg-primary hover:bg-green-900 text-white px-4 h-8 rounded-md"
      >
        New
      </button>
    </div>
  );
};

export default TableActions;
