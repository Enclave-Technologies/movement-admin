"use client";

import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/server_functions/auth";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push("/my-clients");
    }, []);

    // const username = await getCurrentUser();

    // return (
    //     // Use only tailwind CSS
    //     <div className="min-h-screen bg-gray-50">
    //         {username ? (
    //             <div className="mt-20 text-center text-2xl font-bold">
    //                 Hello, {username.name}
    //             </div>
    //         ) : (
    //             <p> Loading ... </p>
    //         )}
    //     </div>
    // );
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-between gap-2">
                <LoadingSpinner />
                <span>Redirecting to my clients page.</span>
            </div>
        </div>
    );
}
