import Image from "next/image";
import React from "react";
import { defaultProfileURL } from "@/configs/constants";
import Link from "next/link";

const TrainerInfo = ({
    userDetails,
    loading,
    error,
}: {
    userDetails: TrainerDetails;
    loading: boolean;
    error: any;
}) => {
    const defaultImageURL = defaultProfileURL;
    const trainer: trainerSidebarInfo = {
        name: `${userDetails?.firstName || "FirstName"} ${
            userDetails?.lastName || "LastName"
        }`,
        image: userDetails?.imageURL || defaultImageURL,
        description:
            userDetails?.jobTitle || "Personal Trainer | Body Transformation",
    };

    if (loading) {
        return (
            <div className="animate-pulse flex flex-col items-center gap-1">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="flex flex-col items-center gap-0.5">
                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                    <div className="w-48 h-3 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.toString()}</div>;
    }

    return (
        <Link href="/" className="cursor-pointer">
            <div className="flex flex-col items-center gap-1">
                <Image
                    src={trainer.image}
                    className="aspect-square object-cover rounded-full"
                    alt={trainer.name}
                    // unoptimized
                    width={80}
                    height={80}
                />
                <div className="flex flex-col items-center gap-0.5">
                    <h2>{trainer.name}</h2>
                    <span className="text-center text-gray-300 text-sm">
                        {trainer.description}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default TrainerInfo;
