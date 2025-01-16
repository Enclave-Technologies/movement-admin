"use client";

import Searchbar from "@/components/pure-components/Searchbar";
import TrainerTable from "@/components/TrainerTable";
import { API_BASE_URL, defaultProfileURL } from "@/configs/constants";
import RightModal from "@/components/pure-components/RightModal";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { LIMIT } from "@/configs/constants";
import Pagination from "@/components/pure-components/Pagination";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import UserSkeleton from "@/components/pageSkeletons/userSkeleton";
import { fetchUserDetails } from "@/server_functions/auth";
import RegisterTrainerForm from "@/components/forms/RegisterTrainerForm";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";

const CoachingTeam = () => {
    const { myDetails: trainerDetails } = useGlobalContext();
    const [modified, setModified] = useState(true);
    const [added, setAdded] = useState(true);
    const [showRightModal, setShowRightModal] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    // const router = useRouter();

    const queryClient = new QueryClient();

    const columns = useMemo<ColumnDef<CoachTemplate>[]>(
        () => [
            {
                accessorKey: "imageUrl",
                header: "",
                cell: (info) => (
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Image
                            src={
                                info.getValue() &&
                                String(info.getValue()).trim() !== ""
                                    ? String(info.getValue())
                                    : defaultProfileURL
                            } // Provide a default placeholder
                            width={32}
                            height={32}
                            alt={`Image of ${info.row.original.name}`}
                            className="rounded-full"
                        />
                    </div>
                ),
                size: 50,
                enableSorting: false,
            },
            {
                header: "Name",
                accessorKey: "name",
                cell: (info) => (
                    <div className="whitespace-nowrap cursor-pointer text-sm font-semibold underline">
                        {info.getValue() as String}
                    </div>
                ),
                size: 200,
            },
            {
                header: "Title",
                accessorKey: "jobTitle",
                size: 250,
                // enableSorting: false,
            },
            {
                header: "Email",
                accessorKey: "email",
                size: 250,
            },
            {
                header: "Phone",
                accessorKey: "phone",
                size: 150,
            },
            // {
            //     header: "Status",
            //     accessorKey: "status",
            // },
        ],
        []
    );

    async function fetchTrainers(
        start: number,
        size: number,
        sorting: SortingState
    ) {
        // let response: any;
        const pageNo = start / size + 1;

        const url = new URL(`${API_BASE_URL}/mvmt/v1/admin/trainers`);
        url.searchParams.set("limit", size.toString());
        url.searchParams.set("pageNo", pageNo.toString());

        if (sorting.length) {
            const sort = sorting[0] as ColumnSort;
            const { id, desc } = sort;
            url.searchParams.set("sort_by", id);
            url.searchParams.set("sort_order", desc ? "desc" : "asc");
        }

        if (globalFilter) {
            url.searchParams.set("search_query", globalFilter);
        }

        const response = await axios.get(url.toString(), {
            withCredentials: true,
        });

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
                formTitle="Add Trainer / Admin"
                isVisible={showRightModal}
                hideModal={() => {
                    setShowRightModal(false);
                }}
            >
                <div className="w-full">
                    <RegisterTrainerForm
                        fetchData={() => {
                            setAdded((prev) => !prev);
                        }}
                    />
                </div>
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
                    <h1 className="text-xl font-bold text-black ml-2 leading-tight">
                        Coaching Team
                    </h1>
                    {trainerDetails?.team.name === "Admins" && (
                        <button
                            onClick={() => {
                                setShowRightModal(true);
                            }}
                            className="bg-primary text-white py-2 px-4 rounded-md"
                        >
                            + Add Trainer
                        </button>
                    )}
                </div>
                <Searchbar
                    search={globalFilter}
                    setSearch={setGlobalFilter}
                    placeholder="Search"
                />
                <div>
                    <QueryClientProvider client={queryClient}>
                        <ScrollTable
                            queryKey="allUsers"
                            columns={columns}
                            fetchData={fetchTrainers}
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

export default CoachingTeam;
