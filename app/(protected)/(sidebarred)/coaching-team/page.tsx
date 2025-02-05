"use client";

import { API_BASE_URL, defaultProfileURL } from "@/configs/constants";
import RightModal from "@/components/pure-components/RightModal";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import axios from "axios";
import React, { useMemo, useState } from "react";
import RegisterTrainerForm from "@/components/forms/RegisterTrainerForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";
import TableActions from "@/components/InfiniteScrollTable/TableActions";
import LoadingSpinner from "@/components/LoadingSpinner";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import Toast from "@/components/Toast";
import EditTrainerForm from "@/components/forms/edit-trainer-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TbEdit } from "react-icons/tb";

const CoachingTeam = () => {
    const { myDetails: trainerDetails, reloadData } = useGlobalContext();
    const [modified, setModified] = useState(true);
    const [added, setAdded] = useState(true);
    const [showRightModal, setShowRightModal] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [deletePressed, setDeletePressed] = useState(false);
    const [modalButtonLoadingState, setModalButtonLoadingState] =
        useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [editRow, setEditRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const openDeleteConfirmation = () => {
        setDeletePressed(true);
    };

    const handleDeleteCancel = () => {
        setDeletePressed(false);
    };

    const handleBatchDelete = async () => {
        setModalButtonLoadingState(true);

        try {
            const response = await axios.delete(
                `${API_BASE_URL}/mvmt/v1/admin/trainers`,
                {
                    data: {
                        ids: selectedRows.map((row) => row.uid),
                    },
                    withCredentials: true,
                }
            );

            setDeletePressed(false);
            setSelectedRows([]);
            setModified((prevModified) => !prevModified);
            setModalButtonLoadingState(false);

            setToastMessage("Coaches deleted successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error("Error deleting users:", error);
            setDeletePressed(false);
            setModalButtonLoadingState(false);
            setToastMessage("Error deleting coaches");
            setToastType("error");
            setShowToast(true);
        }
    };

    const handleToastClose = () => {
        setShowToast(false);
    };

    const handleTrainerEditClicked = (rowData: CoachTemplate) => {
        setEditRow(rowData);
        // editRowRef.current = rowData;
        setShowEditModal(true);
    };

    const rightEditModal = () => {
        return (
            <RightModal
                formTitle="Edit Trainer / Admin"
                isVisible={showEditModal}
                hideModal={() => {
                    setShowEditModal(false);
                    setEditRow(null);
                }}
            >
                <EditTrainerForm
                    fetchData={() => {
                        setModified((prevState) => !prevState);
                    }}
                    clientData={editRow}
                    // rowData={editRowRef.current}
                />
            </RightModal>
        );
    };

    const queryClient = new QueryClient();

    const columns = useMemo<ColumnDef<CoachTemplate>[]>(
        () => [
            {
                accessorKey: "checkbox",
                header: () => (
                    <div className="w-10 h-10 flex items-center justify-center">
                        <input
                            className=""
                            type="checkbox"
                            onClick={() => {
                                if (selectedRows.length > 0) {
                                    setSelectedRows([]);
                                } else {
                                    setSelectedRows((prevSelectedRows) => {
                                        const newSelectedRows = Array.from(
                                            new Set([
                                                ...prevSelectedRows,
                                                ...rows.map(
                                                    (row) => row.original
                                                ),
                                            ])
                                        );
                                        return newSelectedRows;
                                    });
                                }
                            }}
                            checked={selectedRows.length > 0 ? true : false}
                        />
                    </div>
                ),
                cell: (info) => (
                    <div className="w-10 h-10 flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={selectedRows.find(
                                (u) => u.uid === info.row.original.uid
                            )}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setSelectedRows((prevSelectedRows) => [
                                        ...prevSelectedRows,
                                        info.row.original,
                                    ]);
                                } else {
                                    setSelectedRows((prevSelectedRows) =>
                                        prevSelectedRows.filter(
                                            (row, index) =>
                                                index !== info.row.index
                                        )
                                    );
                                }
                            }}
                        />
                    </div>
                ),
                size: 50,
                enableSorting: false,
            },
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
                    <Link
                        href={`/trainer/${info.row.original.uid}`}
                        className="whitespace-nowrap cursor-pointer text-sm hover:underline"
                    >
                        {info.getValue() as String}
                    </Link>
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
                size: 200,
            },
            {
                header: "",
                accessorKey: "actions",
                cell: (info) =>
                    trainerDetails?.team.includes("Admins") && (
                        <button
                            className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600 "
                            onClick={() => {
                                const coachData = {
                                    uid: info.row.original.uid,
                                    auth_id: info.row.original.uid,
                                    name: info.row.original.name,
                                    firstName:
                                        info.row.original.name.split(" ")[0],
                                    lastName:
                                        info.row.original.name.split(" ")[1],
                                    email: info.row.original.email,
                                    phone: info.row.original.phone,
                                    imageUrl: info.row.original.imageUrl,
                                    gender: info.row.original.gender,
                                    jobTitle: info.row.original.jobTitle,
                                    role: info.row.original.role,
                                };

                                handleTrainerEditClicked(coachData);
                            }}
                        >
                            <TbEdit />
                        </button>
                    ),
                meta: {
                    className: "sticky right-0 border-l-[1px] border-gray-500",
                },
            },
        ],
        [trainerDetails, rows, selectedRows]
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
                            reloadData();
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
        <main className="flex flex-col bg-transparent text-black">
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex flex-row items-center justify-between py-2 border-b-[1px] border-gray-200">
                    <div className="flex flex-row gap-2 items-center">
                        <span className="text-lg font-bold">Coaching Team</span>
                        {isFetching && <LoadingSpinner className="h-4 w-4" />}
                    </div>
                    {/* <pre>{JSON.stringify(trainerDetails.team, null, 2)}</pre> */}
                    <TableActions
                        showDelete={trainerDetails?.team.includes("Admins")}
                        showNew={trainerDetails?.team.includes("Admins")}
                        openDeleteConfirmation={openDeleteConfirmation}
                        columns={columns}
                        selectedRows={selectedRows}
                        tableSearchQuery={globalFilter}
                        setTableSearchQuery={setGlobalFilter}
                        onClickNewButton={() => {
                            setShowRightModal(true);
                        }}
                    />
                </div>
                <div>
                    <QueryClientProvider client={queryClient}>
                        <ScrollTable
                            setRows={setRows}
                            queryKey="allUsers"
                            columns={columns}
                            fetchData={fetchTrainers}
                            dataAdded={added}
                            dataModified={modified}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            setIsFetching={setIsFetching}
                        />
                    </QueryClientProvider>
                </div>
                {rightModal()}
                {rightEditModal()}
                {deletePressed && (
                    <DeleteConfirmationDialog
                        title="batch of coaches? 
                        This will remove them from users. 
                        Are you sure you want to delete them?"
                        confirmDelete={handleBatchDelete}
                        cancelDelete={handleDeleteCancel}
                        isLoading={modalButtonLoadingState}
                    />
                )}
                {showToast && (
                    <Toast
                        message={toastMessage}
                        onClose={handleToastClose}
                        type={toastType}
                    />
                )}
            </div>
        </main>
    );
};

export default CoachingTeam;
