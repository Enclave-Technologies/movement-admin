"use client";

import React from "react";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import Breadcrumb from "@/components/Breadcrumb";

const dummyData = [
    {
        date: "01/01/2024",
        height: "5'8\"",
        weight: "150 lbs",
        chin: "14 in",
        cheek: "12 in",
        pec: "38 in",
        bice: "12 in",
    },
    {
        date: "01/02/2024",
        height: "5'7\"",
        weight: "145 lbs",
        chin: "13 in",
        cheek: "11 in",
        pec: "37 in",
        bice: "11 in",
    },
    {
        date: "01/03/2024",
        height: "5'6\"",
        weight: "160 lbs",
        chin: "15 in",
        cheek: "13 in",
        pec: "40 in",
        bice: "13 in",
    },
];

const Page = () => {
    const { userData } = useUser(); // Access the user data from Context
    const page_title = ["BMI Records"];
    console.log(userData);
    return (
        <div>
            <div className="ml-12">
                <Breadcrumb
                    homeImage={userData?.imageUrl}
                    homeTitle={userData?.name}
                    customTexts={page_title}
                />
            </div>
            <div className="p-4 flex flex-col min-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
                        Body Mass Composition
                    </h1>
                    <button className="border border-[#000000] bg-white text-black p-2 rounded hover:bg-blue-500 hover:text-white transition duration-200 sm:p-3">
                        + Create New Entry
                    </button>
                </div>

                {/* Table with Header and Rows */}
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border border-gray-300">
                        <thead className="bg-[#005B40] text-white">
                            <tr className="border-collapse">
                                <th className="p-2 text-center text-sm sm:text-base">
                                    Date
                                </th>
                                <th className="p-2 text-center text-sm sm:text-base">
                                    Height
                                </th>
                                <th className="p-2 text-center text-sm sm:text-base">
                                    Weight
                                </th>
                                <th className="p-2 text-center text-sm sm:text-base">
                                    Chin
                                </th>
                                <th className="p-2 text-center text-sm sm:text-base">
                                    Cheek
                                </th>
                                <th className="p-2 text-center text-sm sm:text-base">
                                    PEC
                                </th>
                                <th className="p-2 text-center text-sm sm:text-base">
                                    BICE
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyData.map((entry, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? "bg-gray-200"
                                            : "bg-gray-100"
                                    }
                                >
                                    <td className="border border-gray-800 p-2 text-center">
                                        {entry.date}
                                    </td>
                                    <td className="border border-gray-800 p-2 text-center">
                                        {entry.height}
                                    </td>
                                    <td className="border border-gray-800 p-2 text-center">
                                        {entry.weight}
                                    </td>
                                    <td className="border border-gray-800 p-2 text-center">
                                        {entry.chin}
                                    </td>
                                    <td className="border border-gray-800 p-2 text-center">
                                        {entry.cheek}
                                    </td>
                                    <td className="border border-gray-800 p-2 text-center">
                                        {entry.pec}
                                    </td>
                                    <td className="border border-gray-800 p-2 text-center">
                                        {entry.bice}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col items-center mt-10">
                    <p className="text-sm sm:text-base">
                        No Exercises added to this session yet.
                    </p>
                    <p className="text-sm sm:text-base">
                        Click on <strong>+ Add Exercise</strong> to start adding
                        exercises
                    </p>
                </div>

                <div className="flex flex-col items-center mt-10 py-2 border border-[#000000] rounded-lg">
                    <p className="text-sm sm:text-base">+ Create New Entry</p>
                </div>

                {/* Back Button at the Bottom Left */}
                <div className="mt-auto flex justify-start">
                    <button className="text-white w-36 bg-[#006847] rounded-md py-1 sm:w-40 sm:py-2">
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
