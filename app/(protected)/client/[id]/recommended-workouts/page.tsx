"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { userData } = useUser();
    const page_title = ["Training Program"];
    const id = params.id;

    // State variables for dropdown options
    const [firstDropdownOptions, setFirstDropdownOptions] = useState([
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ]);

    const [secondDropdownOptions, setSecondDropdownOptions] = useState([
        { value: "optionA", label: "Option A" },
        { value: "optionB", label: "Option B" },
        { value: "optionC", label: "Option C" },
    ]);

    // State variable for table data
    const [tableData, setTableData] = useState<PhaseRow[]>([]);

    // Example useEffect to load data for dropdowns and table
    useEffect(() => {
        // Simulate an API call or data fetching
        // const fetchDropdownData = async () => {
        //     // Replace this with actual data fetching logic
        //     const firstDropdownData = await fetchFirstDropdownData();
        //     const secondDropdownData = await fetchSecondDropdownData();
        //     setFirstDropdownOptions(firstDropdownData);
        //     setSecondDropdownOptions(secondDropdownData);
        // };
        // const fetchTableData = async () => {
        //     // Replace this with actual data fetching logic
        //     const data = await fetchTableDataFromDB();
        //     setTableData(data);
        // };
        // fetchDropdownData();
        // fetchTableData();
    }, []); // Empty dependency array means this runs once on mount

    const handleAddPhase = () => {
        router.push(`/client/${id}/recommended-workouts/untitled-phase`);
    };

    return (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />
            Recommended
            <div className="flex items-center space-x-4">
                <select className="border rounded p-2">
                    {firstDropdownOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="text-gray-500">&gt;</span>
                <select className="border rounded p-2">
                    {secondDropdownOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {/* Table Component */}
            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Order</th>
                        <th className="border border-gray-300 p-2">Motion</th>
                        <th className="border border-gray-300 p-2">
                            Specific Description
                        </th>
                        <th className="border border-gray-300 p-2">Reps Min</th>
                        <th className="border border-gray-300 p-2">Reps Max</th>
                        <th className="border border-gray-300 p-2">Sets Min</th>
                        <th className="border border-gray-300 p-2">Sets Max</th>
                        <th className="border border-gray-300 p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">
                                {row.order}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {row.motion}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {row.specificDescription}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {row.repsMin}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {row.repsMax}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {row.setsMin}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {row.setsMax}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {/* {row.column3} */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Button Component */}
            <button
                onClick={handleAddPhase}
                className="w-full mt-4 p-2 border-2 rounded"
            >
                + Add Phase
            </button>
        </div>
    );
};

export default Page;

interface PhaseRow {
    order: number;
    motion: string;
    specificDescription: string;
    repsMin: number;
    repsMax: number;
    setsMin: number;
    setsMax: number;
}
