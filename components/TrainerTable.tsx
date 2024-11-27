import { defaultProfileURL } from "@/configs/constants";
import Image from "next/image";
import { useMemo, useState } from "react";
import Table from "./Table";

const TrainerTable = ({ trainers }) => {
  console.log(trainers);
  const headers = ["", "Name", "Description", "Email", "Phone"];
  const head = useMemo(() => {
    return headers.map((header, index) => {
      return (
        <th
          key={index}
          className="font-normal pl-5 pr-4 h-12  whitespace-nowrap"
        >
          {header}
        </th>
      );
    });
  }, [headers]);

  const rows = useMemo(() => {
    return trainers.map((trainer, index) => {
      return (
        <tr
          key={index}
          className={`${
            index % 2 ? "bg-gray-50" : "bg-white"
          } h-16 hover:bg-gray-100 transition-colors`}
        >
          <td className="pl-6 pr-4">
            <div className="w-10 h-10">
              <Image
                src={trainer.imageUrl || defaultProfileURL}
                width={40}
                height={40}
                alt={`Image of ${trainer.name}`}
                className="rounded-full"
              />
            </div>
          </td>
          <td className="pl-6 pr-4 whitespace-nowrap">{trainer.name}</td>
          <td className="pl-6 pr-4 whitespace-nowrap">{trainer.jobTitle}</td>
          <td className="pl-6 pr-4 whitespace-nowrap">{trainer.email}</td>
          <td className="pl-6 pr-4 whitespace-nowrap">{trainer.phone}</td>
        </tr>
      );
    });
  }, [trainers]);
  return (
    <main className="flex flex-col bg-gray-100 text-black">
      <Table rows={rows} head={head} />
    </main>
  );
};

export default TrainerTable;
