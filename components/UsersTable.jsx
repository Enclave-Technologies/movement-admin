"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import Image from "next/image";
import { defaultProfileURL } from "@/configs/constants";
import { useRouter } from "next/navigation";
import Table from "./Table";

const UsersTable = ({ search, clients }) => {
    const router = useRouter();

    const handleRowClick = (client) => {
        // Implement the action you want to execute on double-click

        // For example, you can redirect to the client details page
        // window.location.href = `client/${client.uid}`;
        router.push(`client/${client.uid}`);
    };

    const head = useMemo(() => {
        return ["", "Full Name", "Email", "Phone Number", "Trainer", ""].map(
            (header, index) => {
                return (
                    <th
                        key={index}
                        className="text-xs uppercase font-bold pl-5 pr-4 h-8  whitespace-nowrap"
                    >
                        {header}
                    </th>
                );
            }
        );
    }, []);

    const rows = useMemo(() => {
        return clients.map((client, index) => (
            <tr
                key={index}
                className={`${
                    index % 2 ? "bg-white" : "bg-gray-100"
                } h-12 touch-action-none hover:bg-gray-200`}
            >
                <td className="pl-5">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Image
                            src={
                                client.imageUrl && client.imageUrl.trim() !== ""
                                    ? client.imageUrl
                                    : defaultProfileURL
                            } // Provide a default placeholder
                            width={32}
                            height={32}
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
                <td className="pl-5 whitespace-nowrap text-sm underline">
                    {client.trainer_name || "Not Assigned"}
                </td>
                <td className="pl-5 whitespace-nowrap uppercase text-sm">
                    <Link href={`client/${client.uid}`}>
                        <p className="text-sm underline text-green-500 hover:text-gold-500">
                            View Details
                        </p>
                    </Link>
                </td>
            </tr>
        ));
    }, [clients]);

    if (clients.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-[100vh] text-gray-600">
                <p className="font-bold text-lg mb-2">No clients added</p>
                <p className="font-medium">Press add user to get started</p>
            </div>
        );
    }

    return <Table rows={rows} head={head} />;
};

export default UsersTable;
