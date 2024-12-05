import React from "react";
import { IoSearch } from "react-icons/io5";

const UserSkeleton = ({
  pageTitle,
  button_text,
  rowCount = 10,
  buttons = 5,
}) => {
  return (
    <main className="flex flex-col bg-gray-100 text-black">
      <div className="w-full flex flex-col gap-4">
        <div
          className="border bg-white border-gray-300 rounded-full overflow-hidden 
                h-12 w-full px-4 p-2 flex flex-row justify-start items-center gap-2 text-gray-500 animate-pulse"
        >
          <IoSearch className="text-gray-400" size={20} /> Search clients by
          name, email, or phone
        </div>
        <div className="w-full flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold text-black ml-2 leading-tight">
            {pageTitle}
          </h1>
          <div className="bg-primary text-white py-2 px-4 rounded-md animate-pulse">
            + {button_text}
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="w-full">
            <table className="w-full text-left rounded-md overflow-hidden">
              <thead className="">
                <tr className="bg-green-500 text-white">
                  {[
                    "",
                    "Full Name",
                    "Email",
                    "Phone Number",
                    "Trainer",
                    "",
                  ].map((header, index) => {
                    return (
                      <th
                        key={index}
                        className="text-xs uppercase font-bold pl-5 pr-4 h-8  whitespace-nowrap"
                      >
                        {header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="border-t-0 border-white">
                {Array.from({ length: rowCount }, (_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="pl-5 py-1 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    </td>
                    <td className="pl-5 py-1">
                      <div className="w-32 h-8 bg-gray-200"></div>
                    </td>
                    <td className="pl-5 py-1">
                      <div className="w-64 h-8 bg-gray-200"></div>
                    </td>
                    <td className="pl-5 py-1">
                      <div className="w-32 h-8 bg-gray-200"></div>
                    </td>
                    <td className="pl-5 py-1">
                      <div className="w-32 h-8 bg-gray-200"></div>
                    </td>
                    <td className="pl-5 py-1">
                      <div className="w-32 h-8 bg-gray-200"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full flex justify-center items-center mt-4 gap-2">
          {Array.from({ length: buttons }, (_, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-md ${
                index === 0 ? "bg-primary text-white" : "bg-gray-200 text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default UserSkeleton;
