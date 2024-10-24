"use client";
import Image from "next/image";
import axios from "axios";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import { useEffect, useState } from "react";
import LinkTile from "@/components/LinkTile";
import { defaultProfileURL } from "@/configs/constants";

const LinkTileData = [
    {
        href: (params: { id: string }) => `${params.id}/goals`,
        label: "Personal Goals",
        stat: "Completed 9/15",
    },
    {
        href: (params: { id: string }) => `${params.id}/body-mass-composition`,
        label: "Body Mass Composition",
        stat: "24 Entries",
    },
    {
        href: (params: { id: string }) => `${params.id}/recommended-workouts`,
        label: "Recommended Workouts",
        stat: "4 Phases / 18 Sessions",
    },
    {
        href: (params: { id: string }) => `${params.id}/tracked-workouts`,
        label: "Tracked Workouts",
        stat: "76 Entries",
    },
    {
        href: (params: { id: string }) => `${params.id}/profile`,
        label: "Profile",
        // stat: new Date().toLocaleDateString(), // Display today's date
        stat: "Last Updated: " + new Date().toLocaleDateString(),
    },
];

const Page = ({ params }: { params: { id: string } }) => {
    const [dataLoading, setDataLoading] = useState(true);
    const { userData, setUserData, userLoading, userError } = useUser(); // Use the context to set user data

    return (
        <div className="flex flex-col min-h-screen items-center justify-between p-8 bg-white text-black w-full">
            <div className="text-center mt-4 flex flex-col gap-8 w-full">
                {userLoading ? (
                    <div className="flex flex-col gap-4 p-4 bg-white animate-pulse">
                        <div className="flex flex-row gap-12 items-start">
                            <div className="relative">
                                <div className="rounded-full aspect-square object-cover border-2 border-gray-200 w-52 h-52 bg-gray-300"></div>
                            </div>
                            <div className="flex flex-col items-start space-y-4 w-full">
                                <div className="h-12 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ) : userError ? (
                    <p>Error: {userError.message}</p>
                ) : (
                    <div className="flex flex-col gap-4 p-4 bg-white">
                        <div className="flex flex-row gap-12 items-start">
                            <div className="relative">
                                <Image
                                    src={
                                        userData?.imageUrl || defaultProfileURL
                                    }
                                    // unoptimized
                                    height={80}
                                    width={80}
                                    alt={`${userData?.name} image`}
                                    className="rounded-full aspect-square 
                                object-cover border-2 border-gray-200
                                w-52"
                                />
                            </div>
                            <div className="flex flex-col items-start space-y-1">
                                <h2 className="text-5xl font-bold text-gray-800">
                                    {userData?.name}
                                </h2>
                                <p className="text-lg text-gray-600">
                                    {userData?.email || "-"}
                                </p>
                                <p className="text-lg text-gray-600">
                                    {userData?.phone || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-4 gap-4">
                    {LinkTileData.map((tile, index) => (
                        <LinkTile
                            key={index}
                            href={tile.href(params)}
                            label={tile.label}
                            stat={tile.stat}
                            className="flex flex-col items-center 
                            justify-between gap-0 p-4 bg-white border-2 
                            rounded-xl border-primary w-full h-32"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
