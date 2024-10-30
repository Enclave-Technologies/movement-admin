"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import React from "react";

const Page = () => {
    const { userData } = useUser();
    const page_title = ["Profile"];
    return (
        <div>
            <div className="ml-12">
                <Breadcrumb
                    homeImage={userData?.imageUrl}
                    homeTitle={userData?.name}
                    customTexts={page_title}
                />
            </div>
        </div>
    );
};

export default Page;
