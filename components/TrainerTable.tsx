import { defaultProfileURL } from "@/configs/constants";
import Image from "next/image";

const TrainerTable = ({ trainers, pageTitle }) => {
    return (
        <main className="flex flex-col bg-gray-100 text-black">
            <div className="w-full mt-8 mx-auto max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
                <div className="shadow-lg rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-green-500 text-white">
                                <th className="font-medium pl-6 pr-4 py-3 whitespace-nowrap">
                                    Image
                                </th>
                                <th className="font-medium pl-6 pr-4 py-3 whitespace-nowrap">
                                    Name
                                </th>
                                <th className="font-medium pl-6 pr-4 py-3 whitespace-nowrap">
                                    Job Title
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {trainers.map((client, index) => (
                                <tr
                                    key={index}
                                    className={`${
                                        index % 2 ? "bg-gray-50" : "bg-white"
                                    } h-16 hover:bg-gray-100 transition-colors`}
                                >
                                    <td className="pl-6 pr-4">
                                        <div className="w-10 h-10">
                                            <Image
                                                src={
                                                    client.imageUrl ||
                                                    defaultProfileURL
                                                }
                                                width={40}
                                                height={40}
                                                alt={`Image of ${client.name}`}
                                                className="rounded-full"
                                            />
                                        </div>
                                    </td>
                                    <td className="pl-6 pr-4 whitespace-nowrap">
                                        {client.name}
                                    </td>
                                    <td className="pl-6 pr-4 whitespace-nowrap">
                                        {client.jobTitle}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default TrainerTable;
