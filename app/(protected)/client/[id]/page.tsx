"use client";
import Image from "next/image";
import axios from "axios";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import { useEffect } from "react";
import LinkTile from "@/components/LinkTile";


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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Page = ({ params }: { params: { id: string } }) => {
    const { userData, setUserData } = useUser(); // Use the context to set user data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/client?client_id=${params.id}`,
                    {
                        withCredentials: true, // Include cookies in the request
                    }
                );
                setUserData(response.data); // Assuming setUserData updates the user data
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();

        setUserData(params); // Store the user data in Context API
    }, [params, setUserData]);

   
    return (
        <main className="flex flex-col min-h-screen items-center justify-between p-8 bg-white text-black w-full">
            <div className="text-center mt-4 flex flex-col gap-8 w-full">
                <div className="flex flex-col gap-4 p-4 bg-white">
                    <div className="flex flex-row gap-4 items-center">

                        <div className="relative">
                            <Image
                                src={userData?.imageUrl || ""}
                                unoptimized
                                height={80}
                                width={80}
                                alt={`${userData?.name} image`}
                                className="rounded-full aspect-square object-cover border-2 border-gray-200 opacity-0 transition-opacity duration-300 ease-in-out"
                                onLoad={(e) => { e.currentTarget.style.opacity = 1; }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full animate-pulse">
                                <span className="text-gray-400">Loading...</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start space-y-1">
                            <h2 className="text-xl font-bold text-gray-800">
                                {userData?.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {userData?.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                {userData?.phone}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {LinkTileData.map((tile, index) => (
                        <LinkTile
                            key={index}
                            href={tile.href(params)}
                            label={tile.label}
                            stat={tile.stat}

                            className="flex flex-col items-center justify-between gap-0 p-4 bg-white border-2 rounded-xl border-primary w-full h-32"

                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Page;
