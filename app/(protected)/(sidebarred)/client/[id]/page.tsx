"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/context/ClientContext";
import LinkTile from "@/components/LinkTile";
import { defaultProfileURL } from "@/configs/constants";
import axios from "axios";
import Link from "next/link";
import RecentWorkoutHistory from "@/components/client/RecentWorkoutHistory";
import ClientDetails from "@/components/client/ClientDetails";
import { useRouter } from "next/router";

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
    <div className="flex flex-col min-h-screen items-center justify-between bg-gray-50 text-black w-full">
      <div className="text-center flex flex-col gap-4 w-full">
        {userLoading ? (
          <div className="flex flex-col gap-4 p-4">
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
          <div className="flex flex-col gap-4 py-4 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-4 items-start sm:items-start">
              <div className="relative">
                <Image
                  src={
                    userData.imageUrl && userData.imageUrl.trim() !== ""
                      ? userData.imageUrl
                      : defaultProfileURL
                  }
                  // src={
                  //     userData?.imageUrl || defaultProfileURL
                  // }
                  height={72}
                  width={72}
                  alt={`${userData?.name} image`}
                  className="rounded-full aspect-square 
                                object-cover border-2 border-gray-200
                                "
                />
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-lg md:text-2xl lg:text-xl font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                  {userData?.name}
                </h2>
                <p className="text-base text-gray-600">
                  {userData?.email || "-"}
                </p>
                <p className="text-base text-gray-600">
                  {userData?.phone || "-"}
                </p>
              </div>
            </div>
          </div>
        )}
        <ClientDetails client_id={params.id} />
      </div>
    </div>
  );
};

export default Page;
