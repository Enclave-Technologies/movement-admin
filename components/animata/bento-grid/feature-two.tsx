"use client";
import AvatarList from "../list/avatar-list";
import Counter from "../text/counter";
import BentoCard from "./bento-card";

export default function FeatureTwo() {
    return (
        <BentoCard className="relative flex flex-col overflow-visible bg-violet-500 sm:col-span-2">
            <strong className="text-2xl font-semibold text-white">
                <Counter
                    targetValue={179}
                    format={(v) => +Math.ceil(v) + "k+ students"}
                />
            </strong>
            <div className="ml-4 mt-auto">
                <AvatarList size="sm" className="py-0" />
            </div>
        </BentoCard>
    );
}
