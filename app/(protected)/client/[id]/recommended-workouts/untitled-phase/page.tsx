"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
    const { userData } = useUser();

    const page_title = ["Training Program", "Untitled Phase"];
    return (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />
        </div>
    );
};

export default Page;
