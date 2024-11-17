"use client";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { defaultProfileURL } from "@/configs/constants";
import { useRouter } from "next/navigation";

const ClientsTable = ({ clients, fetchMoreData, hasMore, pageTitle }) => {
    const [search, setSearch] = useState("");
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
        console.log("Client clicked:", client);
        // For example, you can redirect to the client details page
        // window.location.href = `client/${client.uid}`;
        router.push(`client/${client.uid}`);
    };

    return (
        <main className="flex flex-col bg-gray-100 text-black">
            <div className="w-full">
                <div
                    className="border border-gray-400 rounded-2xl overflow-hidden 
                h-12 w-full p-2 m-2 mt-6"
                >
                    <input
                        className="w-full h-full focus:outline-none bg-gray-100"
                        value={search}
                        placeholder="Search clients by name, email, or phone"
                        onChange={(e) => {
                            console.log(e.target.value);
                            setSearch(e.target.value);
                        }}
                    />
                </div>
                <h1 className="text-3xl font-bold text-black mt-5 mb-5 ml-2 leading-tight">
                    {pageTitle}
                </h1>
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
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-green-500 text-white">
                                <th className="font-normal pl-5 pr-4 h-12"></th>
                                <th className="font-normal pl-5 pr-4 h-12">
                                    Client Name
                                </th>
                                <th className="font-normal pl-5 pr-4">Email</th>
                                <th className="font-normal pl-5 pr-4">
                                    Phone Number
                                </th>
                                <th className="font-normal pl-5 pr-4">
                                    Trainer Name
                                </th>
                                <th className="font-normal pl-5 pr-4">
                                    Action
                                </th>
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
                                    onClick={() => handleRowClick(client)}
                                >
                                    <td className="pl-5">
                                        <Image
                                            src={
                                                client.imageUrl ||
                                                defaultProfileURL
                                            } // Provide a default placeholder
                                            width={30}
                                            height={30}
                                            alt={`Image of ${client.name}`}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="pl-5">{client.name}</td>
                                    <td className="pl-5">
                                        {client.email || "-"}
                                    </td>
                                    <td className="pl-5">
                                        {client.phone || "-"}
                                    </td>
                                    <td className="pl-5">
                                        {client.trainer_name || "Not Assigned"}
                                    </td>
                                    <td className="pl-5">
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
