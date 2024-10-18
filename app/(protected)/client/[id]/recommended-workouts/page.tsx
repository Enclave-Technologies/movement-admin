"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import BreadcrumbLoading from "@/components/BreadcrumbLoading";

const Page = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { userData, setUserData } = useUser();
    const page_title = ["Training Program"];
    const id = params.id;
    const [pageLoading, setPageLoading] = useState(true);
    const [pendingOperations, setPendingOperations] = useState(0);

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
    const [phaseList, setPhaseList] = useState<PhaseRow[]>([]);

    // Example useEffect to load data for dropdowns and table
    // useEffect(() => {
    //     let isMounted = true; // To prevent state updates on unmounted components
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `http://127.0.0.1:8000/mvmt/v1/trainer/client?client_id=${params.id}`,
    //                 {
    //                     withCredentials: true, // Include cookies in the request
    //                 }
    //             );
    //             if (isMounted) {
    //                 setUserData(response.data); // Assuming setUserData updates the user data
    //             }
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //         } finally {
    //             if (isMounted) {
    //                 console.log("USER DATA LOADING", pendingOperations);
    //                 setPendingOperations((prev) => prev - 1); // Decrement pending operations
    //             }
    //         }
    //     };

    //     const performOtherAsyncOperations = async () => {
    //         // Example of another async operation
    //         try {
    //             // Perform other async operations here
    //             const response = await axios.get(
    //                 `http://127.0.0.1:8000/mvmt/v1/client/phases?client_id=${params.id}`,
    //                 {
    //                     withCredentials: true, // Include cookies in the request
    //                 }
    //             );
    //             console.log(response.data);
    //             // await new Promise((resolve) => setTimeout(resolve, 1000));
    //         } catch (error) {
    //             console.error("Error in other async operations:", error);
    //         } finally {
    //             console.log(isMounted);
    //             if (isMounted) {
    //                 console.log("OTHER ASYNC OPERATIONS", pendingOperations);
    //                 setPendingOperations((prev) => prev - 1); // Decrement pending operations
    //             }
    //         }
    //     };

    //     setPageLoading(true); // Set loading to true before fetching data
    //     setPendingOperations(2); // Set the number of pending operations

    //     if (!userData) {
    //         fetchData();
    //     } else {
    //         console.log("USERDATA FOUND!", pendingOperations);
    //         setPendingOperations((prev) => prev - 1); // Decrement pending operations if userData is already available
    //     }
    //     performOtherAsyncOperations();
    //     return () => {
    //         isMounted = false; // Cleanup function to prevent state updates on unmounted components
    //     };
    // }, [params.id, setUserData, userData, pendingOperations]); // Empty dependency array means this runs once on mount

    // useEffect(() => {
    //     if (pendingOperations === 0) {
    //         setPageLoading(false); // Set loading to false when all operations are completed
    //     }
    // }, [pendingOperations]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/mvmt/v1/trainer/client?client_id=${params.id}`,
                    { withCredentials: true }
                );
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const performOtherAsyncOperations = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/mvmt/v1/client/phases?client_id=${params.id}`,
                    { withCredentials: true }
                );
                console.log(response.data);
            } catch (error) {
                console.error("Error in other async operations:", error);
            }
        };

        setPageLoading(true);

        const fetchAllData = async () => {
            if (!userData) {
                await fetchData();
            }
            await performOtherAsyncOperations();
            setPageLoading(false);
        };

        fetchAllData();
    }, [params.id, setUserData, userData]);

    const handleAddPhase = () => {
        router.push(`/client/${id}/recommended-workouts/new-phase`);
    };

    return pageLoading ? (
        <div>
            <BreadcrumbLoading />
            <div className="flex items-center space-x-4">
                <div className="border rounded p-2 w-1/2 animate-pulse bg-gray-300">
                    <div className="h-4 bg-gray-400 rounded"></div>
                </div>
                <span className="text-gray-500">&gt;</span>
                <div className="border rounded p-2 w-1/2 animate-pulse bg-gray-300">
                    <div className="h-4 bg-gray-400 rounded"></div>
                </div>
            </div>

            <div className="mt-4">
                <div className="w-full h-64 border-collapse border border-gray-300 animate-pulse bg-gray-200">
                    <div className="h-full bg-gray-300"></div>
                </div>
            </div>

            <button
                onClick={handleAddPhase}
                className="w-full mt-4 p-2 border-2 rounded animate-pulse bg-gray-300"
                disabled
            >
                + Add Phase
            </button>
        </div>
    ) : (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />

            <div className="flex items-center space-x-4">
                <select className="border rounded p-2 w-1/2">
                    {firstDropdownOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="text-gray-500">&gt;</span>
                <select className="border rounded p-2 w-1/2">
                    {secondDropdownOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {/* Table Component */}
            {phaseList.length === 0 ? (
                <p className="text-gray-600">
                    No Exercises added to this session yet.
                    <br />
                    Click on + Add Session to add a new session.
                </p>
            ) : (
                <table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">
                                Order
                            </th>
                            <th className="border border-gray-300 p-2">
                                Motion
                            </th>
                            <th className="border border-gray-300 p-2">
                                Specific Description
                            </th>
                            <th className="border border-gray-300 p-2">
                                Reps Min
                            </th>
                            <th className="border border-gray-300 p-2">
                                Reps Max
                            </th>
                            <th className="border border-gray-300 p-2">
                                Sets Min
                            </th>
                            <th className="border border-gray-300 p-2">
                                Sets Max
                            </th>
                            <th className="border border-gray-300 p-2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {phaseList.map((row, index) => (
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
            )}
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
