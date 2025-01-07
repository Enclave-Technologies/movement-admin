"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { fetchUserDetails } from "@/server_functions/auth";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    OnChangeFn,
    Row,
    ColumnSort,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {
    useInfiniteQuery,
    QueryClient,
    QueryClientProvider,
    keepPreviousData,
} from "@tanstack/react-query";
import { makeData, Person } from "@/app/api/MockApi";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";

const ExercisePage = () => {
    const { countDoc, exercises, setExercises, reloadData } =
        useGlobalContext();
    const [lastId, setLastId] = useState(null);
    const [trainerDetails, setTrainerDetails] = useState(null);

    const queryClient = new QueryClient();
    const data = makeData(1000);

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

    const columns = React.useMemo<ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: "firstName",
                cell: (info) => info.getValue(),
            },
            {
                accessorFn: (row) => row.lastName,
                id: "lastName",
                cell: (info) => info.getValue(),
                header: () => <span>Last Name</span>,
            },
            {
                accessorKey: "age",
                header: () => "Age",
                size: 50,
            },
            {
                accessorKey: "visits",
                header: () => <span>Visits</span>,
                size: 50,
            },
            {
                accessorKey: "status",
                header: "Status",
            },
            {
                accessorKey: "progress",
                header: "Profile Progress",
                size: 80,
            },
        ],
        []
    );

    async function fetchData(
        start: number,
        size: number,
        sorting: SortingState
    ) {
        // const response = await fetch(
        //     `/api/exercises?start=${start}&limit=${limit}`
        // );
        // const data = await response.json();
        // return data;

        console.log(start, size, sorting, start / size + 1);
        console.log(data.length);

        const dbData = [...data];
        if (sorting.length) {
            const sort = sorting[0] as ColumnSort;
            const { id, desc } = sort as { id: keyof Person; desc: boolean };
            dbData.sort((a, b) => {
                if (desc) {
                    return a[id] < b[id] ? 1 : -1;
                }
                return a[id] > b[id] ? 1 : -1;
            });
        }

        //simulate a backend api
        await new Promise((resolve) => setTimeout(resolve, 200));

        return {
            data: dbData.slice(start, start + size),
            meta: {
                totalRowCount: dbData.length,
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

    if (!countDoc || !trainerDetails) {
        return null;
    }

    return (
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
    );
};

export default ExercisePage;
