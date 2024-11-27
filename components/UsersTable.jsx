"use client";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useMemo } from "react";
import Image from "next/image";
import { defaultProfileURL } from "@/configs/constants";
import { useRouter } from "next/navigation";
import Table from "./Table";

const UsersTable = ({ search, setSearch, clients, fetchMoreData, hasMore }) => {
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

  const head = useMemo(() => {
    return ["", "Full Name", "Email", "Phone Number", "Trainer", ""].map(
      (header, index) => {
        return (
          <th
            key={index}
            className="font-normal pl-5 pr-4 h-12  whitespace-nowrap"
          >
            {header}
          </th>
        );
      }
    );
  }, []);

  const rows = useMemo(() => {
    return filteredClients.map((client, index) => (
      <tr
        key={index}
        className={`${
          index % 2 ? "bg-white" : "bg-gray-100"
        } h-12 touch-action-none cursor-pointer hover:bg-gray-200`}
        onClick={() => handleRowClick(client)}
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
        <td className="pl-5 whitespace-nowrap">{client.name}</td>
        <td className="pl-5 whitespace-nowrap">{client.email || "-"}</td>
        <td className="pl-5 whitespace-nowrap">{client.phone || "-"}</td>
        <td className="pl-5 whitespace-nowrap">
          {client.trainer_name || "Not Assigned"}
        </td>
        <td className="pl-5 whitespace-nowrap">
          <Link href={`client/${client.uid}`}>
            <p className="text-sm underline text-green-500 hover:text-gold-500">
              View Details
            </p>
          </Link>
        </td>
      </tr>
    ));
  }, [filteredClients]);

  return <Table rows={rows} head={head} />;

  return (
    <div className="w-full">
      <InfiniteScroll
        dataLength={clients.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <h4 className="text-center text-sm text-gray-700 w-full animate-pulse  mt-4">
            Loading...
          </h4>
        }
        endMessage={
          <p className="text-center text-sm text-gray-700 w-full mt-4">
            All data entries loaded.
          </p>
        }
      >
        <table className="w-full text-left rounded-md overflow-hidden">
          <thead className="">
            <tr className="bg-green-500 text-white">
              <th className="font-normal pl-5 pr-4 h-12  whitespace-nowrap"></th>
              <th className="font-normal pl-5 pr-4 h-12  whitespace-nowrap">
                Full Name
              </th>
              <th className="font-normal pl-5 pr-4  whitespace-nowrap">
                Email
              </th>
              <th className="font-normal pl-5 pr-4  whitespace-nowrap">
                Phone Number
              </th>
              <th className="font-normal pl-5 pr-4  whitespace-nowrap">
                Trainer
              </th>
              <th className="font-normal pl-5 pr-4  whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody className="border-t-0 border-white">
            {filteredClients.map((client, index) => (
              <tr
                // key={client.$id}
                key={index}
                className={`${
                  index % 2 ? "bg-white" : "bg-gray-100"
                } h-12 touch-action-none cursor-pointer hover:bg-gray-200`}
                onClick={() => handleRowClick(client)}
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
                <td className="pl-5 whitespace-nowrap">{client.name}</td>
                {/* <td className="pl-5 whitespace-nowrap">
                  {client.name.split(" ")[1]}
                </td> */}
                <td className="pl-5 whitespace-nowrap">
                  {client.email || "-"}
                </td>
                <td className="pl-5 whitespace-nowrap">
                  {client.phone || "-"}
                </td>
                <td className="pl-5 whitespace-nowrap">
                  {client.trainer_name || "Not Assigned"}
                </td>
                <td className="pl-5 whitespace-nowrap">
                  <Link href={`client/${client.uid}`}>
                    <p className="text-sm underline text-green-500 hover:text-gold-500">
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
  );
};

export default UsersTable;
