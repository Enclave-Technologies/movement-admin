"use client";
import React, { useEffect, useMemo, useState } from "react";
import { fetchUserDetails } from "@/server_functions/auth";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";
import axios from "axios";
import RightModal from "@/components/pure-components/RightModal";
import AddExerciseForm from "@/components/forms/add-exercise-form";
import { API_BASE_URL } from "@/configs/constants";
import { ExerciseTemplate } from "@/types";
import Searchbar from "@/components/pure-components/Searchbar";

const ExercisePage = () => {
    const [modified, setModified] = useState(true);
    const [added, setAdded] = useState(true);
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [showRightModal, setShowRightModal] = useState(false);
    const [updatingExercise, setUpdatingExercise] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Separate useEffect hook for fetching user details
    useEffect(() => {
        const fetchTrainerDetails = async () => {
            const details = await fetchUserDetails();
            setTrainerDetails(details);
        };
        fetchTrainerDetails();
    }, []);

    const queryClient = new QueryClient();

    const handleApprovalStatusChange = async (
        rowData: ExerciseTemplate,
        newApprovalStatus: boolean
    ) => {
        setUpdatingExercise([...updatingExercise, rowData.id]);
        // Implement your logic here, e.g., update the approval status in the database
        console.log(
            "Approval status changed for row:",
            rowData,
            newApprovalStatus
        );

        try {
            console.log("SENDING INFO TO BACKEND", rowData.id);
            const response = await axios.put(
                `${API_BASE_URL}/mvmt/v1/admin/exercises/${rowData.id}`,
                {
                    approved: newApprovalStatus,
                },
                {
                    withCredentials: true,
                }
            );

            setModified((prevModified) => !prevModified);
        } catch (error) {
            console.error("Error updating exercise approval:", error);
        } finally {
            setUpdatingExercise(
                updatingExercise.filter((id) => id !== rowData.id)
            );
        }
    };

    const columns = useMemo<ColumnDef<ExerciseTemplate>[]>(
        () => [
            {
                accessorKey: "motion",
                cell: (info) => info.getValue(),
                header: () => "Motion",
                size: 200,
                filterFn: "includesString",
            },
            {
                accessorFn: (row) => row.targetArea,
                id: "targetArea",
                cell: (info) => info.getValue(),
                header: () => "Target Area",
                size: 250,
            },
            {
                accessorKey: "fullName",
                header: () => "Exercise Name",
                size: 300,
                cell: (info) => (
                    <div
                        className={`px-4 py-2 font-semibold underline cursor-pointer"
                        }`}
                        onClick={() => {
                            alert(
                                `clicked ${JSON.stringify(info.row.original)}`
                            );
                            // handleApprovalClick(info.row.original)
                        }}
                    >
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "shortName",
                header: () => "Shortened Name",
                size: 250,
            },
            // {
            //     accessorKey: "approved",
            //     header: "Approval Status",
            //     size: 180,
            //     cell: (info) => (
            //         <div>{info.getValue() ? "Approved" : "Unapproved"}</div>
            //     ),
            // },
            {
                accessorKey: "approved",
                header: "Approval Status",
                size: 180,
                cell: (info) => (
                    <div className="flex items-center">
                        {trainerDetails?.team.name === "Admins" ? (
                            <select
                                value={info.getValue() ? "true" : "false"}
                                onChange={(e) =>
                                    handleApprovalStatusChange(
                                        info.row.original,
                                        e.target.value === "true"
                                    )
                                }
                                className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="true">Approved</option>
                                <option value="false">Unapproved</option>
                            </select>
                        ) : info.getValue() ? (
                            "Approved"
                        ) : (
                            "Not Approved"
                        )}
                    </div>
                ),
            },
        ],
        [trainerDetails]
    );

    async function fetchData(
        start: number,
        size: number,
        sorting: SortingState
    ) {
        let response: any;
        const pageNo = start / size + 1;
        if (sorting.length) {
            const sort = sorting[0] as ColumnSort;
            const { id, desc } = sort as {
                id: keyof ExerciseTemplate;
                desc: boolean;
            };
            const order = desc ? "desc" : "asc";
            response = await axios.get(
                `${API_BASE_URL}/mvmt/v1/admin/exercises?limit=${size}&pageNo=${pageNo}&sort_by=${id}&sort_order=${order}`,
                {
                    withCredentials: true,
                }
            );
        } else {
            response = await axios.get(
                `${API_BASE_URL}/mvmt/v1/admin/exercises?limit=${size}&pageNo=${pageNo}`,
                {
                    withCredentials: true,
                }
            );
        }

        const { data, total } = response.data;

        console.log(data.length);
        console.log(total);
        return {
            data: data,
            meta: {
                totalRowCount: total,
            },
        };
    }

    const rightModal = () => {
        return (
            <RightModal
                formTitle="Add Exercise"
                isVisible={showRightModal}
                hideModal={() => {
                    setShowRightModal(false);
                }}
            >
                <AddExerciseForm
                    fetchData={() => {
                        setAdded((prevAdded) => !prevAdded);
                    }}
                    team={trainerDetails?.team.name}
                />
            </RightModal>
        );
    };

    if (!trainerDetails) {
        return null;
    }

    return (
        <main className="flex flex-col bg-gray-100 text-black">
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex flex-row items-center justify-between">
                    <span className="text-lg font-bold ml-4">
                        Exercise List
                    </span>

                    <button
                        onClick={() => {
                            setShowRightModal(true);
                        }}
                        className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                        + Add Exercise
                    </button>
                </div>
                <Searchbar
                    search={globalFilter}
                    setSearch={setGlobalFilter}
                    placeholder="Search"
                />
                <div>
                    <QueryClientProvider client={queryClient}>
                        <ScrollTable
                            queryKey="exercises"
                            columns={columns}
                            fetchData={fetchData}
                            dataAdded={added}
                            dataModified={modified}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </QueryClientProvider>
                </div>
                {rightModal()}
            </div>
        </main>
    );
};

export default ExercisePage;
