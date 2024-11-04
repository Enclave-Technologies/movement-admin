"use client";

import { GoalTile } from "@/components/GoalTile";
import { goals } from "./dummyData";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";

const Page = () => {
    const { userData } = useUser();

    const page_title = ["Goals"];

    return (
        <div className="text-center flex flex-col gap-8 w-full">
            <div className="ml-12">
                <Breadcrumb
                    homeImage={userData?.imageUrl}
                    homeTitle={userData?.name}
                    customTexts={page_title}
                />
            </div>
            <div className="w-full flex flex-row justify-end gap-4">
                <button className="primary-btn">Add Goal</button>
                <button className="secondary-btn">Edit Goals</button>
            </div>
            <div className="flex flex-col w-full gap-8">
                {goals.map((goal, i) => (
                    <div
                        key={i}
                        className="flex flex-col w-full items-start gap-4"
                    >
                        <h1 className="uppercase text-xl font-bold">
                            {goal.type}
                        </h1>
                        <div className="flex flex-col gap-1 w-full">
                            {goal.goals.map((goal, index) => (
                                <GoalTile key={index} goal={goal} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
