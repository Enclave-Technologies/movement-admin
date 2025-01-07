"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { fetchUserDetails } from "@/server_functions/auth";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";
import axios from "axios";
import RightModal from "@/components/pure-components/RightModal";
import AddExerciseForm from "@/components/forms/add-exercise-form";
import { API_BASE_URL } from "@/configs/constants";
import { ExerciseTemplate } from "@/types";

const ExercisePage = () => {
    const { countDoc, exercises, setExercises, reloadData } =
        useGlobalContext();
    // const [lastId, setLastId] = useState(null);
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [showRightModal, setShowRightModal] = useState(false);

    const queryClient = new QueryClient();
    // const data = makeData(1000);

    // const columns = useMemo<ColumnDef<any>[]>(
    //     () => [
    //         {
    //             accessorKey: "$id",
    //             header: "ID",
    //             size: 60,
    //         },
    //         {
    //             accessorKey: "targetArea",
    //             cell: (info) => info.getValue(),
    //         },
    //         {
    //             accessorFn: (row) => row.fullName,
    //             id: "fullName",
    //             cell: (info) => info.getValue(),
    //             header: () => <span>Exercise</span>,
    //         },
    //         {
    //             accessorKey: "shortName",
    //             header: () => "Shortened Name",
    //             size: 50,
    //         },
    //         {
    //             accessorKey: "motion",
    //             header: () => <span>Motion</span>,
    //             size: 50,
    //         },
    //         {
    //             accessorKey: "approved",
    //             header: "Status",
    //         },
    //     ],
    //     []
    // );

    const columns = useMemo<ColumnDef<ExerciseTemplate>[]>(
        () => [
            {
                accessorKey: "motion",
                cell: (info) => info.getValue(),
                header: () => "Motion",
                size: 200,
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
            {
                accessorKey: "approved",
                header: "Approval Status",
                size: 180,
                cell: (info) => (
                    <div>{info.getValue() ? "Approved" : "Unapproved"}</div>
                ),
            },
        ],
        []
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

    // Separate useEffect hook for fetching user details
    useEffect(() => {
        const fetchTrainerDetails = async () => {
            const details = await fetchUserDetails();
            setTrainerDetails(details);
        };
        fetchTrainerDetails();
    }, []);

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
                    fetchData={reloadData}
                    team={trainerDetails?.team.name}
                />
            </RightModal>
        );
    };

    if (!countDoc || !trainerDetails) {
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
                <div>
                    <QueryClientProvider client={queryClient}>
                        <ScrollTable
                            queryKey="exercises"
                            datacount={countDoc?.exercises_count}
                            columns={columns}
                            fetchData={fetchData}
                        />
                    </QueryClientProvider>
                </div>
                {rightModal()}
            </div>
        </main>
    );
};

export default ExercisePage;
