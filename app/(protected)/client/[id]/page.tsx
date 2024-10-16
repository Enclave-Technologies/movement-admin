"use client";
import Image from "next/image";
import axios from "axios";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import { useEffect } from "react";
import LinkTile from "@/components/LinkTile";
// import Breadcrumb from "@/components/Breadcrumb";

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
    const { userData, setUserData } = useUser(); // Use the context to set user data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/mvmt/v1/trainer/client?client_id=${params.id}`,
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

    const user = {
        uid: "1",
        name: "John Doe",
        email: "johndoe@gmail.com",
        phone: "123-456-7890",
        trainer_id: 123,
        trainer_name: "Jane Smith",
        image: "https://movementfitnesshk.com/wp-content/uploads/2024/07/Gina-Lai.png",
    };
    return (
        <main className="flex flex-col min-h-screen items-center justify-between p-8 bg-white text-black w-full">
            <div className="text-center mt-4 flex flex-col gap-8 w-full">
                <div className="flex flex-col gap-4 p-4 bg-white">
                    <div className="flex flex-row gap-4 items-center">
                        <Image
                            src={userData?.imageUrl}
                            unoptimized
                            height={80}
                            width={80}
                            alt={`${userData?.name} image`}
                            className="rounded-full aspect-square object-cover border-2 border-gray-200"
                        />
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
                    {/* <Breadcrumb customTexts={customTexts} /> */}
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {/* <LinkTile
                        href={`${params.id}/goals`}
                        label="Personal Goals"
                        stat="Completed 9/15"
                        className="w-52 h-48"
                    />
                    <LinkTile
                        href={`${params.id}/body-mass-composition`}
                        label="Body Mass Composition"
                        stat="24 Entries"
                        className="w-52 h-48"
                    />
                    <LinkTile
                        href={`${params.id}/training-plan`}
                        label="Training Plan"
                        stat="4 Phases / 18 Sessions"
                        className="w-52 h-48"
                    />
                    <LinkTile
                        href={`${params.id}/workouts`}
                        label="Workout History"
                        stat="76 Entries"
                        className="w-52 h-48"
                    />
                    <LinkTile
                        href={`${params.id}/workout-tracker`}
                        label="Track New Workout"
                        stat=""
                        className="w-52 h-48"
                    /> */}
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
        </main>
    );
};

export default Page;
