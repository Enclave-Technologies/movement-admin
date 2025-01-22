import { defaultProfileURL } from "@/configs/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";

const SearchResults = ({ results, setSearch, isLoading }) => {
  const router = useRouter();
  const handleClick = (client) => {
    setSearch("");
    window.open(`/client/${client.uid}`);
  };
  console.log(results);
  return (
    <div className="absolute w-full top-[40px] z-50 px-6">
      <div className="bg-white shadow-md p-2 rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-start gap-2 p-2">
            <LoadingSpinner className="h-4 w-4" />
          </div>
        ) : results.length > 0 ? (
          <Fragment>
            {results.map((user, index) => (
              <div
                key={index}
                className="flex px-4 py-2 cursor-pointer bg-white hover:bg-gray-200 items-center justify-between"
                onClick={() => handleClick(user)}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      user.imageUrl?.trim() !== ""
                        ? user.imageUrl
                        : defaultProfileURL
                    }
                    width={32}
                    height={32}
                    alt={`Image of ${user.name}`}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <p>{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <FaExternalLinkAlt />
              </div>
            ))}
          </Fragment>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
