import { defaultProfileURL } from "@/configs/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const SearchResults = ({ results, setSearch }) => {
  const router = useRouter();
  const handleClick = (client) => {
    setSearch("");
    router.push(`/client/${client.uid}`);
  };
  console.log(results);
  return (
    <div className="absolute w-full top-[70px] z-50 px-6">
      <div className="bg-white shadow-md p-2 rounded-lg border border-gray-200">
        {results.map((user, index) => {
          return (
            <div
              className="flex px-4 py-2 cursor-pointer bg-white hover:bg-gray-200 items-center justify-between"
              onClick={() => {
                handleClick(user);
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={
                    user.imageUrl && user.imageUrl.trim() !== ""
                      ? user.imageUrl
                      : defaultProfileURL
                  } // Provide a default placeholder
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
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
