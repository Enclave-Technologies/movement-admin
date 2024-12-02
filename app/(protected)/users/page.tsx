"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UsersTable from "@/components/UsersTable";
import Searchbar from "@/components/pure-components/Searchbar";
import AddUserForm from "@/components/forms/add-user-form";
import RightModal from "@/components/pure-components/RightModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AllClients() {
    const [clients, setClients] = useState<Client[]>([]); // State to hold the clients data
    const [lastId, setLastId] = useState(""); // State to hold the last ID of the fetched clients
    const [isFetching, setIsFetching] = useState(false); // State to track if a fetch is in progress
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [tableLoading, setTableLoading] = useState(true);
    const [showRightModal, setShowRightModal] = useState(false);

    // useEffect(() => {
    //     debouncedFetchData(lastId);
    // }, [lastId]);

    // const debounce = (func: Function, wait: number) => {
    //     let timeout: NodeJS.Timeout;
    //     return function (this: any, ...args: any[]) {
    //         const context = this;
    //         clearTimeout(timeout);
    //         timeout = setTimeout(() => func.apply(context, args), wait);
    //     };
    // };

    const fetchData = async (lastId: string) => {
        if (isFetching) return; // Prevent multiple simultaneous fetches
        setIsFetching(true);

        // const current_user = await getCurrentUser();
        // const userId = current_user?.$id; // Extract the $id property

        // const response = await axios.get(
        //     `${API_BASE_URL}/mvmt/v1/trainer/clients?lastId=${lastId}&limit=50`,
        //     {
        //         withCredentials: true, // Include cookies in the request
        //     }
        // );
        // // const newItems = await response.json();
        // const newItems = response.data;
        // // Filter out newItems that already exist in clients
        // const uniqueNewItems = newItems.filter(
        //     (newItem: Client) =>
        //         !clients.some((client) => client.uid === newItem.uid)
        // );

        // setClients((prevItems) => [...prevItems, ...uniqueNewItems]);
        // if (newItems.length === 0 || newItems.length < 50) {
        //     setHasMore(false);
        // }
        // } else {
        //     setClients((prevItems) => [...prevItems, ...newItems]);
        // }
        setIsFetching(false);
    };

    // const debouncedFetchData = useCallback(debounce(fetchData, 300), [
    //     fetchData,
    // ]);

    // const fetchMoreData = () => {
    //     const newLastId = clients[clients.length - 1]?.uid;
    //     setLastId(newLastId);
    //     fetchData(newLastId);
    // };

    const rightModal = () => {
        return (
            <RightModal
                formTitle="Add User"
                isVisible={showRightModal}
                hideModal={() => {
                    setShowRightModal(false);
                }}
            >
                <AddUserForm fetchData={fetchData} />
            </RightModal>
        );
    };

    return (
        <main className="flex flex-col bg-gray-100 text-black">
            <div className="w-full flex flex-col gap-4">
                <Searchbar search={search} setSearch={setSearch} />
                <div className="w-full flex flex-row items-center justify-between">
                    <h1 className="text-xl font-bold text-black ml-2 leading-tight">
                        All Users
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
                <UsersTable
                    clients={clients}
                    hasMore={hasMore}
                    search={search}
                    setSearch={setSearch}
                    // fetchMoreData={fetchMoreData}
                    fetchMoreData={() => {}}
                />
                {rightModal()}
            </div>
        </main>
    );
}
