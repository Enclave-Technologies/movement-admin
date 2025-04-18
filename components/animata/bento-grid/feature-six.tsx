"use client";

import BarChart from "../graphs/bar-chart";
import BentoCard from "./bento-card";

export default function FeatureSix() {
    return (
        <BentoCard className="bg-green-200">
            <BarChart
                items={[
                    {
                        progress: 30,
                        label: "Jan",
                        className: "rounded-xl bg-green-400",
                    },
                    {
                        progress: 70,
                        label: "S",
                        className: "rounded-xl bg-green-400",
                    },
                    {
                        progress: 60,
                        label: "M",
                        className: "rounded-xl bg-green-400",
                    },
                    {
                        progress: 90,
                        label: "T",
                        className: "rounded-xl bg-green-400",
                    },
                    {
                        progress: 10,
                        label: "W",
                        className: "rounded-xl bg-green-400",
                    },
                    {
                        progress: 20,
                        label: "Th",
                        className: "rounded-xl bg-green-400",
                    },
                    {
                        progress: 30,
                        label: "F",
                        className: "rounded-xl bg-green-400",
                    },
                    {
                        progress: 90,
                        label: "Sa",
                        className: "rounded-xl bg-green-400",
                    },
                ]}
                height={100}
            />
            <div className="mt-2 text-center font-bold">Weekly review</div>
        </BentoCard>
    );
}
