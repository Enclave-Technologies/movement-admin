"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import { useRouter, useSearchParams } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
    const { userData } = useUser();
    const searchParams = useSearchParams();
    // Extract the phaseTitle and sessions from the query parameters
    const phaseTitle = searchParams.get("phaseTitle") || "Phase 1";

    const page_title = ["Training Program", phaseTitle, "New Phase"];
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
