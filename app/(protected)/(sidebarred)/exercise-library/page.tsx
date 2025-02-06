"use client";
import React, { useMemo, useRef, useState } from "react";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";
import axios from "axios";
import RightModal from "@/components/pure-components/RightModal";
import AddExerciseForm from "@/components/forms/add-exercise-form";
import { API_BASE_URL } from "@/configs/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import TableActions from "@/components/InfiniteScrollTable/TableActions";
import LoadingSpinner from "@/components/LoadingSpinner";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import BatchConfirmationDialog from "@/components/InfiniteScrollTable/batchConfirmationDialog";
import Toast from "@/components/Toast";
import { TbCheck, TbCross, TbEdit } from "react-icons/tb";
import EditExerciseForm from "@/components/forms/edit-exercise-form";
import { Button } from "@/components/ui/button";

const ExercisePage = () => {
    const [modified, setModified] = useState(true);
    const [added, setAdded] = useState(true);
    const [showRightModal, setShowRightModal] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [updatingExercise, setUpdatingExercise] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const { myDetails: trainerDetails } = useGlobalContext();
    const [selectedRows, setSelectedRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [deletePressed, setDeletePressed] = useState(false);
    const [batchApprovalPressed, setBatchApprovalPressed] = useState(false);
    const [modalButtonLoadingState, setModalButtonLoadingState] =
        useState(false);
    const [approving, setApproving] = useState(false);
    const [batchOpTitle, setBatchOpTitle] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [editRow, setEditRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const queryClient = new QueryClient();

    const handleApprovalStatusChange = async (
        rowData: ExerciseTemplate,
        newApprovalStatus: boolean
    ) => {
        setUpdatingExercise([...updatingExercise, rowData.id]);
        // Implement your logic here, e.g., update the approval status in the database

        try {
            const response = await axios.put(
                `${API_BASE_URL}/mvmt/v1/admin/exercises`,
                {
                    updates: [
                        {
                            id: rowData.id,
                            approved: newApprovalStatus,
                        },
                    ],
                },
                {
                    withCredentials: true,
                }
            );

            setModified((prevModified) => !prevModified);
            setToastMessage("Exercise approval status updated successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error("Error updating exercise approval:", error);
        } finally {
            setUpdatingExercise(
                updatingExercise.filter((id) => id !== rowData.id)
            );
        }
    };

    const handleBatchDelete = async () => {
        setModalButtonLoadingState(true);
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/mvmt/v1/admin/exercises`,
                {
                    data: {
                        ids: selectedRows.map((row) => row.id),
                    },
                    withCredentials: true,
                }
            );

            setDeletePressed(false);
            setSelectedRows([]);
            setModified((prevModified) => !prevModified);
            setModalButtonLoadingState(false);

            setToastMessage("Exercises deleted successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error("Error deleting exercises:", error);
            setDeletePressed(false);
            setModalButtonLoadingState(false);
            setToastMessage("Error deleting exercises");
            setToastType("error");
            setShowToast(true);
        }
    };

    const handleBatchApproval = async () => {
        setModalButtonLoadingState(true);

        const exerciseUpdates = selectedRows.map((row) => ({
            id: row.id,
            approved: approving,
        }));

        try {
            await axios.put(
                `${API_BASE_URL}/mvmt/v1/admin/exercises`,
                {
                    updates: exerciseUpdates,
                },
                {
                    withCredentials: true,
                }
            );

            setBatchApprovalPressed(false);
            setSelectedRows([]);
            setModified((prevModified) => !prevModified);
            setToastMessage("Batch of exercises updated successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error("Error updating exercises:", error);
        } finally {
            setModalButtonLoadingState(false);
            setApproving(false);
        }
    };

    const openBatchApproveConfirmation = (approving: boolean = false) => {
        if (approving) {
            setApproving(true);
            setBatchOpTitle(
                "Are you sure you want to approve this batch of exercises?"
            );
        } else {
            setApproving(false);
            setBatchOpTitle(
                "Are you sure you want to unapprove this batch of exercises?"
            );
        }
        setBatchApprovalPressed(true);
    };

    const closeBatchApproveConfirmation = () => {
        setBatchApprovalPressed(false);
    };

    const handleExerciseEditClicked = (rowData: ExerciseTemplate) => {
        setEditRow(rowData);
        // editRowRef.current = rowData;
        setShowEditModal(true);
    };

    const openDeleteConfirmation = () => {
        setDeletePressed(true);
    };

    const handleDeleteCancel = () => {
        setDeletePressed(false);
    };

    const columns = useMemo<ColumnDef<ExerciseTemplate>[]>(
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
                            defaultChecked={
                                selectedRows.length > 0 ? true : false
                            }
                        />
                    </div>
                ),
                cell: (info) => (
                    <div className="w-10 h-10 flex items-center justify-center">
                        <input
                            type="checkbox"
                            defaultChecked={selectedRows.find(
                                (u) => u.id === info.row.original.id
                            )}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setSelectedRows((prevSelectedRows) => [
                                        ...prevSelectedRows,
                                        info.row.original,
                                    ]);
                                } else {
                                    setSelectedRows((prevSelectedRows) => {
                                        return prevSelectedRows.filter(
                                            (row) =>
                                                row.id !== info.row.original.id
                                        );
                                    });
                                }
                            }}
                        />
                    </div>
                ),
                size: 50,
                enableSorting: false,
            },
            {
                accessorKey: "motion",
                cell: (info) => info.getValue(),
                header: "Motion",
                size: 200,
                filterFn: "includesString",
            },
            {
                accessorFn: (row) => row.targetArea,
                accessorKey: "targetArea",
                id: "targetArea",
                cell: (info) => info.getValue(),
                header: "Target Area",
                size: 250,
            },
            {
                accessorKey: "fullName",
                header: "Exercise Name",
                size: 300,
                cell: (info) => (
                    <div
                    // className={`px-4 py-2 font-semibold underline cursor-pointer"
                    // }`}
                    >
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "shortName",
                header: "Shortened Name",
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
                        {trainerDetails?.team.includes("Admins") ? (
                            <select
                                value={info.getValue() ? "true" : "false"}
                                onChange={(e) =>
                                    handleApprovalStatusChange(
                                        info.row.original,
                                        e.target.value === "true"
                                    )
                                }
                                className={`px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    info.getValue()
                                        ? "bg-green-200"
                                        : "bg-red-200"
                                }`}
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
            {
                header: "",
                accessorKey: "actions",
                cell: (info) => (
                    <button
                        className="hover:bg-gray-100 h-8 w-8 rounded-md flex items-center justify-center text-gray-600 "
                        onClick={() => {
                            handleExerciseEditClicked(info.row.original);
                        }}
                    >
                        <TbEdit />
                    </button>
                ),
                size: 49,
                meta: {
                    className:
                        "sticky right-0 border-l-[1px] border-gray-500 items-center",
                },
            },
        ],
        [trainerDetails, rows, selectedRows]
    );

    const handleToastClose = () => {
        setShowToast(false);
    };

    async function fetchData(
        start: number,
        size: number,
        sorting: SortingState
    ) {
        const pageNo = start / size + 1;
        const url = new URL(`${API_BASE_URL}/mvmt/v1/admin/exercises`);
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
                    team={trainerDetails?.team}
                />
            </RightModal>
        );
    };

    const rightEditModal = () => {
        return (
            <RightModal
                formTitle="Edit Exercise"
                isVisible={showEditModal}
                hideModal={() => {
                    setShowEditModal(false);
                    setEditRow(null);
                }}
            >
                <EditExerciseForm
                    refreshTable={() => {
                        setAdded((prevAdded) => !prevAdded);
                    }}
                    team={trainerDetails?.team}
                    rowData={editRow}
                    // rowData={editRowRef.current}
                />
            </RightModal>
        );
    };

    if (!trainerDetails) {
        return null;
    }

    return (
        <main className="flex flex-col bg-transparent text-black">
            <div className="w-full flex flex-col gap-4 h-full">
                <div className="w-full flex flex-row items-center justify-between py-2 border-b-[1px] border-gray-200">
                    <div className="flex flex-row gap-2 items-center">
                        <span className="text-lg font-bold">Exercise List</span>
                        {isFetching && <LoadingSpinner className="h-4 w-4" />}
                    </div>

                    <TableActions
                        showDelete={trainerDetails?.team.includes("Admins")}
                        openDeleteConfirmation={openDeleteConfirmation}
                        columns={columns}
                        selectedRows={selectedRows}
                        tableSearchQuery={globalFilter}
                        setTableSearchQuery={setGlobalFilter}
                        onClickNewButton={() => {
                            setShowRightModal(true);
                        }}
                        additionalActions={
                            <>
                                <button
                                    className="text-black disabled:text-gray-400 px-4 rounded-md h-8 hover:bg-gray-100"
                                    disabled={selectedRows.length === 0}
                                    onClick={() => {
                                        openBatchApproveConfirmation(true);
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    className="text-black disabled:text-gray-400 px-4 rounded-md h-8 hover:bg-gray-100"
                                    disabled={selectedRows.length === 0}
                                    onClick={() => {
                                        openBatchApproveConfirmation(false);
                                    }}
                                >
                                    Unapprove
                                </button>
                            </>
                        }
                    />
                </div>
                <div className="">
                    <QueryClientProvider client={queryClient}>
                        <ScrollTable
                            setRows={setRows}
                            queryKey="exercises"
                            columns={columns}
                            fetchData={fetchData}
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
                        title="batch of exercises? 
                        They might be associated with existing programs. 
                        Are you sure you want to delete them?"
                        confirmDelete={handleBatchDelete}
                        cancelDelete={handleDeleteCancel}
                        isLoading={modalButtonLoadingState}
                    />
                )}
                {batchApprovalPressed && (
                    <BatchConfirmationDialog
                        title={batchOpTitle}
                        confirmOp={handleBatchApproval}
                        cancelOp={closeBatchApproveConfirmation}
                        loadingState={modalButtonLoadingState}
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

export default ExercisePage;
