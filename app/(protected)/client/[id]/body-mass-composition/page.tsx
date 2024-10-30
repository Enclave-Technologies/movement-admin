"use client";

import React from "react";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import Breadcrumb from "@/components/Breadcrumb";

const Page = () => {
    const { userData } = useUser(); // Access the user data from Context
    const page_title = ["BMI Records"];
    console.log(userData);
    return (
        <div>
            <div className="ml-12">
                <Breadcrumb
                    homeImage={userData?.imageUrl}
                    homeTitle={userData?.name}
                    customTexts={page_title}
                />
            </div>
            <h1>Training Plan</h1>
            {userData ? (
                <div>
                    <p>User ID: {userData.uid}</p>
                    {/* Render other user data as needed */}
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default Page;
