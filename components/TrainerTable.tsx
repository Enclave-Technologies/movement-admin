import { defaultProfileURL } from "@/configs/constants";
import Image from "next/image";
import { useMemo, useState } from "react";
import Table from "./Table";

const TrainerTable = ({ trainers, search }) => {
  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      return (
        trainer.name.toLowerCase().includes(search.toLowerCase()) ||
        trainer.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        trainer.email?.toLowerCase().includes(search.toLowerCase()) ||
        trainer.phone?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [trainers, search]);

  const head = useMemo(() => {
    const headers = ["", "Name", "Description", "Email", "Phone"];
    return headers.map((header, index) => {
      return (
        <th
          key={index}
          className="text-xs uppercase font-bold pl-5 pr-4 h-8  whitespace-nowrap"
        >
          {header}
        </th>
      );
    });
  }, []);

  const rows = useMemo(() => {
    return filteredTrainers.map((trainer, index) => {
      return (
        <tr
          key={index}
          className={`${
            index % 2 ? "bg-white" : "bg-gray-100"
          } h-12 touch-action-none hover:bg-gray-200`}
        >
          <td className="pl-5">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src={trainer.imageUrl || defaultProfileURL}
                width={32}
                height={32}
                alt={`Image of ${trainer.name}`}
                className="rounded-full"
              />
            </div>
          </td>
          <td className="pl-5 whitespace-nowrap cursor-pointer text-sm font-semibold underline">
            {trainer.name}
          </td>
          <td className="pl-5 whitespace-nowrap text-sm">{trainer.jobTitle}</td>
          <td className="pl-5 whitespace-nowrap text-sm">{trainer.email}</td>
          <td className="pl-5 whitespace-nowrap text-sm">{trainer.phone}</td>
        </tr>
      );
    });
  }, [filteredTrainers]);
  return (
    <main className="flex flex-col bg-gray-100 text-black">
      <Table rows={rows} head={head} />
    </main>
  );
};

export default TrainerTable;
