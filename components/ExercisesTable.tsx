"use client";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useMemo } from "react";
import Image from "next/image";
import { defaultProfileURL } from "@/configs/constants";
import { useRouter } from "next/navigation";
import Table from "./Table";

const ExercisesTable = ({ search, setSearch, exercises }) => {
  const router = useRouter();

  //   const filteredExercises = useMemo(() => {
  //     return exercises.filter((client) => {
  //       return (
  //         client.name.toLowerCase().includes(search.toLowerCase()) ||
  //         client.email?.toLowerCase().includes(search.toLowerCase()) ||
  //         client.phone?.toLowerCase().includes(search.toLowerCase())
  //       );
  //     });
  //   }, [clients, search]);

  //   const handleRowClick = (client) => {
  //     // Implement the action you want to execute on double-click
  //     console.log("Client clicked:", client);
  //     // For example, you can redirect to the client details page
  //     // window.location.href = `client/${client.uid}`;
  //     router.push(`client/${client.uid}`);
  //   };

  const head = useMemo(() => {
    return [
      "Target Area",
      "Exercise",
      "Bias",
      "Lengthened / Shortened",
      "Impliment",
      "Grip",
      "Angle",
      "Support",
      "Status",
    ].map((header, index) => {
      if (header == "Status") {
        return (
          <th key={index} className="sticky right-0 bg-green-500 z-10 px-4">
            <div className="inline-block whitespace-nowrap">Approved</div>
          </th>
        );
      }
      return (
        <th
          key={index}
          className="font-normal pl-5 pr-4 h-12  whitespace-nowrap"
        >
          {header}
        </th>
      );
    });
  }, []);

  const rows = useMemo(() => {
    return exercises.map((exercise, index) => (
      <tr
        key={index}
        className={`${
          index % 2 ? "bg-white" : "bg-gray-100"
        } h-12 touch-action-none cursor-pointer hover:bg-gray-200`}
        // onClick={() => handleRowClick(client)}
      >
        <td className="pl-5 whitespace-nowrap">{exercise.Motion}</td>
        <td className="pl-5 whitespace-nowrap">
          {exercise.SpecificDescription || "-"}
        </td>
        <td className="pl-5 whitespace-nowrap">
          {exercise.ShortDescription || "-"}
        </td>
        <td className="pl-5 whitespace-nowrap">
          {exercise.RecommendedRepsMin || "Not Assigned"}
        </td>
        <td className="pl-5 whitespace-nowrap">
          <Link href={`client/${exercise.RecommendedSetsMin}`}>
            <p className="text-sm underline text-green-500 hover:text-gold-500">
              View Details
            </p>
          </Link>
        </td>
        <td className="sticky right-0 bg-gray-50 z-10 px-0 py-2">
          <select
            className="w-full whitespace-nowrap  py-3"
            value={exercise.approved}
            // onChange={(e) =>
            //   handleApprovalChange(exercise.$id, e.target.value === "true")
            // }
            // disabled={updatingExercise === exercise.$id}
          >
            <option value="true">Approved</option>
            <option value="false">Not Approved</option>
          </select>
        </td>
      </tr>
    ));
  }, [exercises]);

  return <Table rows={rows} head={head} />;
};

export default ExercisesTable;
