import React from "react";
import { IoSearch } from "react-icons/io5";

const Searchbar = ({ search, setSearch }) => {
  return (
    <div
      className="border bg-white border-gray-200 rounded-full overflow-hidden 
                h-[48px] w-full px-4 p-2 flex flex-row justify-start items-center gap-2 shadow"
    >
      <IoSearch className="text-gray-400" size={20} />
      <input
        className="w-full h-full focus:outline-none placeholder:text-gray-500"
        value={search}
        placeholder="Search by name, email, or phone"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default Searchbar;
