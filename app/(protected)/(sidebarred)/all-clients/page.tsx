"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { getCurrentUser } from "@/server_functions/auth";
import ClientsTable from "@/components/ClientsTable";
import { LIMIT } from "@/configs/constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AllClients() {
    const [clients, setClients] = useState<Client[]>([]); // State to hold the clients data
    const [lastId, setLastId] = useState(""); // State to hold the last ID of the fetched clients
    const [isFetching, setIsFetching] = useState(false); // State to track if a fetch is in progress
    const [hasMore, setHasMore] = useState(true);

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

        // const current_user = await getCurrentUser();
        // const userId = current_user?.$id; // Extract the $id property
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/trainer/clients?lastId=${lastId}&limit=${LIMIT}`,
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
        // } else {
        //     setClients((prevItems) => [...prevItems, ...newItems]);
        // }
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

    return (
        <div>
            {/* <ClientsTable

                clients={clients}
                fetchMoreData={fetchMoreData}
                hasMore={hasMore}
                // pageTitle={"All Clients"}
            /> */}
        </div>
    );
}
