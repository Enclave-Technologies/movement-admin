"use client";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import AddUserForm from "@/components/forms/add-user-form";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";
import TableActions from "@/components/InfiniteScrollTable/TableActions";
import LoadingSpinner from "@/components/LoadingSpinner";
import ScrollTableSkeleton from "@/components/pageSkeletons/scrollTableSkeleton";
import RightModal from "@/components/pure-components/RightModal";
import Searchbar from "@/components/pure-components/Searchbar";
import Toast from "@/components/Toast";
import { API_BASE_URL, defaultProfileURL } from "@/configs/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Page = () => {
    const { myDetails } = useGlobalContext();
    const [modified, setModified] = useState(true);
    const [added, setAdded] = useState(true);
    const [showRightModal, setShowRightModal] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const router = useRouter();
    const queryClient = new QueryClient();
    const [isFetching, setIsFetching] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rows, setRows] = useState([]);

    const [deletePressed, setDeletePressed] = useState(false);
    const [modalButtonLoadingState, setModalButtonLoadingState] =
        useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const handleRowClick = (client) => {
        // Implement the action you want to execute on double-click

        // For example, you can redirect to the client details page
        // window.location.href = `client/${client.uid}`;
        router.push(`client/${client.uid}`);
    };

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
                `${API_BASE_URL}/mvmt/v1/trainer/clients`,
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

            setToastMessage("Users deleted successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error("Error deleting users:", error);
            setDeletePressed(false);
            setModalButtonLoadingState(false);
            setToastMessage("Error deleting users");
            setToastType("error");
            setShowToast(true);
        }
    };

    const handleToastClose = () => {
        setShowToast(false);
    };

    const columns = useMemo<ColumnDef<UserTemplate>[]>(
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
                    <div
                        className="whitespace-nowrap cursor-pointer text-sm font-semibold underline"
                        onClick={() => handleRowClick(info.row.original)}
                    >
                        {info.getValue() as String}
                    </div>
                ),
                size: 200,
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
            {
                header: "Trainer",
                accessorKey: "trainer_name",
                size: 250,
                enableSorting: false,
            },
            // {
            //     header: "Status",
            //     accessorKey: "status",
            // },
        ],
        [rows, selectedRows]
    );

    async function fetchUsers(
        start: number,
        size: number,
        sorting: SortingState
    ) {
        const pageNo = start / size + 1;

        const url = new URL(`${API_BASE_URL}/mvmt/v1/trainer/clients`);

        url.searchParams.set("limit", size.toString());
        url.searchParams.set("tid", myDetails?.$id);
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
                formTitle="Add User"
                isVisible={showRightModal}
                hideModal={() => {
                    setShowRightModal(false);
                }}
            >
                <AddUserForm
                    fetchData={() => {
                        setAdded((prevAdded) => !prevAdded);
                    }}
                    trainerId={myDetails?.$id}
                />
            </RightModal>
        );
    };

    if (!myDetails) {
        return (
            <ScrollTableSkeleton columnCount={columns.length} rowCount={10} />
        );
    }

    return (
        <main className="flex flex-col bg-transparent text-black">
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex flex-row items-center justify-between py-2 border-b-[1px] border-gray-200">
                    <div className="flex flex-row gap-2 items-center">
                        <span className="text-lg font-bold">My Clients</span>
                        {isFetching && <LoadingSpinner className="h-4 w-4" />}
                    </div>
                    <TableActions
                        openDeleteConfirmation={openDeleteConfirmation}
                        columns={columns}
                        selectedRows={selectedRows}
                        onClickNewButton={() => {
                            setShowRightModal(true);
                        }}
                        setTableSearchQuery={setGlobalFilter}
                        tableSearchQuery={globalFilter}
                    />
                </div>
                {/* <Searchbar
                    search={globalFilter}
                    setSearch={setGlobalFilter}
                    placeholder="Search"
                /> */}
                <div>
                    <QueryClientProvider client={queryClient}>
                        <ScrollTable
                            setRows={setRows}
                            queryKey="allUsers"
                            columns={columns}
                            fetchData={fetchUsers}
                            dataAdded={added}
                            dataModified={modified}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            setIsFetching={setIsFetching}
                        />
                    </QueryClientProvider>
                </div>
                {rightModal()}
                {deletePressed && (
                    <DeleteConfirmationDialog
                        title="batch of users? 
                        This will remove them permanently. 
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

export default Page;
