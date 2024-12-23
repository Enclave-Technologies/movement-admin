import React from "react";
import { IoSearch } from "react-icons/io5";

const Searchbar = ({
  search,
  setSearch,
  placeholder = "Search clients by name, email, or phone",
}) => {
  return (
    <div
      className="border bg-white border-gray-300 rounded-full overflow-hidden 
                h-10 w-full px-4 p-2 flex flex-row justify-start items-center gap-2"
    >
      <IoSearch className="text-gray-400" size={20} />
      <input
        className="w-full h-full focus:outline-none placeholder:text-gray-500 text-sm"
        value={search}
        placeholder={placeholder}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default Searchbar;
