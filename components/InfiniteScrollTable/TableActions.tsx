import { useState } from "react";
import { TbArrowsSort, TbFilter, TbSearch } from "react-icons/tb";
import DebouncedInput from "../DebouncedInput";

const TableActions = ({
  onClickNewButton,
  tableSearchQuery,
  setTableSearchQuery,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  return (
    <div className="flex flex-row gap-[4px] items-center">
      <div className="flex flex-row items-center">
        {/* <button className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600">
                    <TbArrowsSort />
                </button>
                <button className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600">
                    <TbFilter />
                </button> */}
        <div className="flex flex-row items-center">
          <button
            className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600"
            onClick={() => setIsSearchExpanded((prev) => !prev)}
          >
            <TbSearch />
          </button>
          {/* <input
            value={tableSearchQuery}
            onChange={(e) => {
              setTableSearchQuery(e.target.value);
            }}
            placeholder="Type to search..."
            className={`${
              isSearchExpanded ? "w-52" : "w-0"
            } bg-transparent focus:outline-none transition-all duration-300 ease-in-out outline-none`}
            ref={(input) => input && input.focus()}
          /> */}
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
