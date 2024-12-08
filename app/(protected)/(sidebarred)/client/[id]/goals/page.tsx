"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import GoalList from "@/components/GoalList";
import { useEffect, useState } from "react";
import axios from "axios";
import { TrainerProvider } from "@/context/TrainerContext";
import { API_BASE_URL } from "@/configs/constants";

const Page = ({ params }: { params: { id: string } }) => {
    const { userData } = useUser();
    const [goals, setGoals] = useState();
    const [pageLoading, setPageLoading] = useState(true);

    const page_title = ["Personal Goals"];

    useEffect(() => {
        async function fetchData() {
            setPageLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/mvmt/v1/client/goals?client_id=${params.id}`,
                { withCredentials: true }
            );
            const data = response.data;
            console.log(data);
            setGoals(data);
            setPageLoading(false);
        }
        fetchData();
    }, []);

    return (
        <TrainerProvider>
            <div className="text-center flex flex-col gap-8 w-full">
                <div className="ml-12">
                    <Breadcrumb
                        homeImage={userData?.imageUrl}
                        homeTitle={userData?.name}
                        customTexts={page_title}
                    />
                </div>
                <GoalList
                    pageLoading={pageLoading}
                    goals={goals}
                    setGoals={setGoals}
                    clientData={userData}
                />
            </div>
        </TrainerProvider>
    );
};

export default Page;
