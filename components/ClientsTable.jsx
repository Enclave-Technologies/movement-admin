"use client";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { defaultProfileURL } from "@/configs/constants";
import { useRouter } from "next/navigation";
import Searchbar from "./pure-components/Searchbar";

const ClientsTable = ({
    search,
    setSearch,
    clients,
    fetchMoreData,
    hasMore,
}) => {
    const router = useRouter();

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            return (
                client.name.toLowerCase().includes(search.toLowerCase()) ||
                client.email?.toLowerCase().includes(search.toLowerCase()) ||
                client.phone?.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [clients, search]);

    const handleRowClick = (client) => {
        // Implement the action you want to execute on double-click

        // For example, you can redirect to the client details page
        // window.location.href = `client/${client.uid}`;
        router.push(`client/${client.uid}`);
    };

    // return "Table here";

    return (
        <main className="flex flex-col bg-gray-100 text-black">
            <div className="w-full">
                <InfiniteScroll
                    dataLength={clients.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <h4 className="text-center text-sm text-gray-700 w-full animate-pulse">
                            Loading...
                        </h4>
                    }
                    endMessage={
                        <p className="text-center text-sm text-gray-700 w-full">
                            No more data to load.
                        </p>
                    }
                >
                    <table className="w-full text-left rounded-md overflow-hidden">
                        <thead>
                            <tr className="bg-green-500 text-white">
                                <th className="text-xs capitalize font-bold pl-5 pr-4 h-8  whitespace-nowrap"></th>
                                <th className="text-xs capitalize font-bold pl-5 pr-4 h-8  whitespace-nowrap">
                                    Full Name
                                </th>
                                <th className="text-xs capitalize font-bold pl-5 pr-4 h-8  whitespace-nowrap">
                                    Email
                                </th>
                                <th className="text-xs capitalize font-bold pl-5 pr-4 h-8  whitespace-nowrap">
                                    Phone Number
                                </th>
                                <th className="text-xs capitalize font-bold pl-5 pr-4 h-8  whitespace-nowrap">
                                    Trainer
                                </th>
                                <th className="text-xs capitalize font-bold pl-5 pr-4 h-8  whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody className="border-t-2 border-white">
                            {filteredClients.map((client, index) => (
                                <tr
                                    // key={client.$id}
                                    key={index}
                                    className={`${
                                        index % 2 ? "bg-gray-50" : "bg-gray-200"
                                    } h-12 touch-action-none`}
                                >
                                    <td className="pl-5">
                                        <div className="w-10 h-10">
                                            <Image
                                                src={
                                                    client.imageUrl &&
                                                    client.imageUrl.trim() !==
                                                        ""
                                                        ? client.imageUrl
                                                        : defaultProfileURL
                                                } // Provide a default placeholder
                                                width={30}
                                                height={30}
                                                alt={`Image of ${client.name}`}
                                                className="rounded-full"
                                            />
                                        </div>
                                    </td>
                                    <td
                                        className="pl-5 whitespace-nowrap cursor-pointer text-sm font-semibold underline"
                                        onClick={() => handleRowClick(client)}
                                    >
                                        {client.name}
                                    </td>
                                    <td className="pl-5 whitespace-nowrap text-sm">
                                        {client.email || "-"}
                                    </td>
                                    <td className="pl-5 whitespace-nowrap text-sm">
                                        {client.phone || "-"}
                                    </td>
                                    <td className="pl-5 whitespace-nowrap text-sm">
                                        {client.trainer_name || "Not Assigned"}
                                    </td>
                                    <td className="pl-5 whitespace-nowrap capitalize text-sm">
                                        <Link href={`client/${client.uid}`}>
                                            <p
                                                className="text-sm underline
                                               text-green-500 hover:text-gold-500"
                                            >
                                                View Details
                                            </p>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </InfiniteScroll>
            </div>
        </main>
    );
};

export default ClientsTable;
