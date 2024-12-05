"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UsersTable from "@/components/UsersTable";
import Searchbar from "@/components/pure-components/Searchbar";
import AddUserForm from "@/components/forms/add-user-form";
import RightModal from "@/components/pure-components/RightModal";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { LIMIT } from "@/configs/constants";
import Pagination from "@/components/pure-components/Pagination";
import UserSkeleton from "@/components/pageSkeletons/userSkeleton";
import { getCurrentUser } from "@/server_functions/auth";
import { API_BASE_URL } from "@/configs/constants";

const fetchData = async (
    lastId: number,
    isFetching: boolean,
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>,
    setClients: React.Dispatch<React.SetStateAction<Client[]>>,
    setPageLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>,
    countDoc: CountsDocument
) => {
    const current_user = await getCurrentUser();

    if (isFetching) return; // Prevent multiple simultaneous fetches
    setIsFetching(true);
    setPageLoading(true);

    const response = await axios.get(
        `${API_BASE_URL}/mvmt/v1/trainer/clients?tid=${current_user?.$id}&pageNo=${lastId}&limit=${LIMIT}`,
        {
            withCredentials: true, // Include cookies in the request
        }
    );
    // // const newItems = await response.json();
    const newItems = response.data;

    setClients(newItems);

    setTotalPages(Math.ceil(newItems.length / LIMIT));

    setIsFetching(false);
    setPageLoading(false);
};

export default function AllClients() {
    const [clients, setClients] = useState<Client[]>([]); // State to hold the clients data
    const [lastId, setLastId] = useState<number>(1); // State to hold the last ID of the fetched clients
    const [totalPages, setTotalPages] = useState<number>(1); // State to hold the last ID of the fetched clients
    const [isFetching, setIsFetching] = useState(false); // State to track if a fetch is in progress

    const [search, setSearch] = useState("");
    const [pageLoading, setPageLoading] = useState(true);
    const [showRightModal, setShowRightModal] = useState(false);
    const { countDoc } = useGlobalContext();

    useEffect(() => {
        if (countDoc) {
            fetchData(
                lastId,
                isFetching,
                setIsFetching,
                setClients,
                setPageLoading,
                setTotalPages,
                countDoc
            );
        }
    }, [lastId, countDoc]);

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
                    fetchData={() =>
                        fetchData(
                            lastId,
                            isFetching,
                            setIsFetching,
                            setClients,
                            setPageLoading,
                            setTotalPages,
                            countDoc
                        )
                    }
                />
            </RightModal>
        );
    };

    if (pageLoading)
        return (
            <UserSkeleton
                button_text="Add User"
                pageTitle="My Clients"
                buttons={totalPages}
                active_page={lastId}
            />
        );

    return (
        <main className="flex flex-col bg-gray-100 text-black">
            <div className="w-full flex flex-col gap-4">
                <Searchbar search={search} setSearch={setSearch} />
                <div className="w-full flex flex-row items-center justify-between">
                    <h1 className="text-xl font-bold text-black ml-2 leading-tight">
                        My Clients
                    </h1>
                    <button
                        onClick={() => {
                            setShowRightModal(true);
                        }}
                        className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                        + Add User
                    </button>
                </div>

                <div className="w-full overflow-x-auto">
                    <UsersTable clients={clients} search={search} />
                </div>

                <Pagination
                    totalPages={totalPages}
                    pageNo={lastId}
                    handlePageChange={(page: number) => {
                        setLastId(page);
                    }}
                />
                {rightModal()}
            </div>
        </main>
    );
}
