<<<<<<<< HEAD:app/(protected)/client/[id]/tracked-workouts/page.tsx
export default function Page() {
    return <h1>Goals</h1>;
}
========
"use client";

import React from "react";
import { useUser } from "@/context/ClientContext"; // Import the custom hook

const Page = () => {
    const { userData } = useUser(); // Access the user data from Context

    return (
        <div>
            <h1>Training Plan</h1>
            {userData ? (
                <div>
                    <p>User ID: {userData.id}</p>
                    {/* Render other user data as needed */}
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default Page;
>>>>>>>> rajkumar:app/(protected)/client/[id]/(subfolders)/body-mass-composition/page.tsx
