import React, { useEffect } from "react";
import { IoSearch } from "react-icons/io5";

const Searchbar = ({
    search,
    setSearch,
    placeholder = "Search clients by name, email, or phone",
}) => {
    const [value, setValue] = React.useState(search);

    useEffect(() => {
        setValue(search);
    }, [search]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(value);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div
            className="border bg-white border-gray-300 rounded-full overflow-hidden 
                h-10 w-full px-4 p-2 flex flex-row justify-start items-center gap-2"
        >
            <IoSearch className="text-gray-400" size={20} />
            <input
                className="w-full h-full focus:outline-none placeholder:text-gray-500 text-sm"
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
        </div>
    );
};

export default Searchbar;
