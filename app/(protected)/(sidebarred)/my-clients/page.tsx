"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { getCurrentUser } from "@/server_functions/auth";
import ClientsTable from "@/components/ClientsTable";
import Searchbar from "@/components/pure-components/Searchbar";
import RightModal from "@/components/pure-components/RightModal";
import AddUserForm from "@/components/forms/add-user-form";
import { LIMIT } from "@/configs/constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MyClients() {
    const [clients, setClients] = useState<Client[]>([]); // State to hold the clients data
    const [lastId, setLastId] = useState(""); // State to hold the last ID of the fetched clients
    const [isFetching, setIsFetching] = useState(false); // State to track if a fetch is in progress
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [showRightModal, setShowRightModal] = useState(false);

    useEffect(() => {
        debouncedFetchData(lastId);
    }, [lastId]);

    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return function (this: any, ...args: any[]) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    };

    const fetchData = async (lastId: string) => {
        if (isFetching) return; // Prevent multiple simultaneous fetches
        setIsFetching(true);

        const current_user = await getCurrentUser();
        const userId = current_user?.$id; // Extract the $id property
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/trainer/clients?tid=${userId}&lastId=${lastId}&limit=${LIMIT}`,
            {
                withCredentials: true, // Include cookies in the request
            }
        );
        // const newItems = await response.json();
        const newItems = response.data;
        console.log(newItems);
        // Filter out newItems that already exist in clients
        const uniqueNewItems = newItems.filter(
            (newItem: Client) =>
                !clients.some((client) => client.uid === newItem.uid)
        );

        setClients((prevItems) => [...prevItems, ...uniqueNewItems]);
        if (newItems.length === 0 || newItems.length < 50) {
            setHasMore(false);
        }
        setIsFetching(false);
    };

    const debouncedFetchData = useCallback(debounce(fetchData, 300), [
        fetchData,
    ]);

    const fetchMoreData = () => {
        const newLastId = clients[clients.length - 1]?.uid;
        setLastId(newLastId);
        fetchData(newLastId);
    };

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
                <ClientsTable
                    clients={clients}
                    hasMore={hasMore}
                    search={search}
                    setSearch={setSearch}
                    fetchMoreData={fetchMoreData}
                />
            </div>
            {rightModal()}
        </main>
    );
}
