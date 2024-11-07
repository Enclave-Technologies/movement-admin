"use client";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useState, useMemo } from "react";

const ClientsTable = ({ clients, fetchMoreData, hasMore }) => {
    const [search, setSearch] = useState("");
  
    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            return client.name.toLowerCase().includes(search.toLowerCase());
            // ||
            // client.email.toLowerCase().includes(search.toLowerCase()) ||
            // client.phone.toLowerCase().includes(search.toLowerCase())
        });
    }, [clients, search]);
    return (
        <main className="flex flex-col bg-white text-black">
        <div className="">
            <div className="border border-gray-400 rounded-full overflow-hidden h-12 w-full max-w-lg px-5 mt-4 mb-3 ml-2  ">
                <input
                    className="w-full h-full"
                    value={search}
                    placeholder="Search clients by name, email, or phone"
                    onChange={(e) => {
                        console.log(e.target.value);
                        setSearch(e.target.value);
                    }}
                />
            </div>
            <h1 className="text-4xl font-bold text-black mt-5 mb-5 ml-2">My Clients</h1>
            <InfiniteScroll
                dataLength={clients.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more data to load.</p>}
            >
                <table className="text-left w-full h-full">
                    <thead>
                        <tr className="gap-10 bg-green-800 text-white">
                            <th className="font-normal min-w-200 pl-5 pr-4 h-12">Client Name</th>
                            <th className="font-normal min-w-200 pr-4 ">Email</th>
                            <th className="font-normal min-w-200 pr-4">Phone Number</th>
                            <th className="font-normal min-w-200 pr-4">Trainer Name</th>
                            <th className="font-normal min-w-200 pr-4">More</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client, index) => (
                            <tr
                                key={client.$id}
                                className={`${index % 2 ? "bg-gray-200" : "bg-white"} h-12`}
                            >
                                <td className="pl-5">{client.name}</td>
                                <td>{client.email}</td>
                                <td>{client.phone}</td>
                                <td>{client.trainer_name}</td>
                                <td>
                                    <Link href={`client/${client.uid}`}>
                                        <p>View Details</p>
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
