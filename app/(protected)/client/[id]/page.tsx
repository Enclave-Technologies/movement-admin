"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/context/ClientContext";
import LinkTile from "@/components/LinkTile";
import { defaultProfileURL } from "@/configs/constants";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const LinkTileData = [
    {
        href: (params: { id: string }) => `${params.id}/goals`,
        label: "Personal Goals",
        statKey: "goals",
    },
    {
        href: (params: { id: string }) => `${params.id}/body-mass-composition`,
        label: "Body Mass Composition",
        statKey: "bmc",
    },
    {
        href: (params: { id: string }) => `${params.id}/recommended-workouts`,
        label: "Workout Planning",
        statKey: "recommendedWorkouts",
    },
    {
        href: (params: { id: string }) => `${params.id}/tracked-workouts`,
        label: "Tracked Workouts",
        statKey: "trackedWorkouts",
    },
    {
        href: (params: { id: string }) => `${params.id}/profile`,
        label: "Profile",
        statKey: "profile",
    },
];

const Page = ({ params }: { params: { id: string } }) => {
    const { userData, userLoading, userError } = useUser(); // Use the context to set user data
    const [stats, setStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/client/all-stats?client_id=${params.id}`,
                    { withCredentials: true }
                );
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, [params.id]);

    return (
        <div className="flex flex-col min-h-screen items-center justify-between p-8 mt-4 bg-gray-100 text-black w-full">
            <div className="text-center mt-4 flex flex-col gap-8 w-full">
                {userLoading ? (
                    <div className="flex flex-col gap-4 p-4 bg-gray-100">
                        <div className="flex flex-col sm:flex-row gap-12 items-center sm:items-start">
                            <div className="relative">
                                <div className="rounded-full aspect-square w-52 sm:w-40 bg-gray-300 animate-pulse"></div>
                            </div>
                            <div className="flex flex-col items-center sm:items-start space-y-1">
                                <div className="h-10 w-48 bg-gray-300 animate-pulse"></div>
                                <div className="h-6 w-64 bg-gray-300 animate-pulse"></div>
                                <div className="h-6 w-64 bg-gray-300 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ) : userError ? (
                    <p>Error: {userError.message}</p>
                ) : (
                    <div className="flex flex-col gap-4 p-4 bg-gray-100">
                        <div className="flex flex-col sm:flex-row gap-4 lg:gap-12 items-center sm:items-start">
                            <div className="relative">
                                <Image
                                    src={
                                        userData?.imageUrl || defaultProfileURL
                                    }
                                    height={80}
                                    width={80}
                                    alt={`${userData?.name} image`}
                                    className="rounded-full aspect-square 
                                object-cover border-2 border-gray-200
                                w-52 sm:w-40 md:w-44"
                                />
                            </div>
                            <div className="flex flex-col items-start space-y-1">
                                <h2 className="text-lg md:text-2xl lg:text-5xl font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {userData?.name}
                                </h2>
                                <p className="text-sm md:text-base lg:text-lg text-gray-600">
                                    {userData?.email || "-"}
                                </p>
                                <p className="text-sm md:text-base lg:text-lg text-gray-600">
                                    {userData?.phone || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {LinkTileData.map((tile, index) => (
                        <LinkTile
                            key={index}
                            href={tile.href(params)}
                            label={tile.label}
                            stat={
                                statsLoading
                                    ? "Loading..."
                                    : stats[tile.statKey] || "N/A"
                            }
                            isLoading={statsLoading}
                            className="flex flex-col items-center justify-between gap-0 p-4 bg-gray-200 border-2 rounded-xl border-primary w-full h-32"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
