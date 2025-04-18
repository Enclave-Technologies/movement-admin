"use client";

import WideCard from "../skeleton/widecard";
import BentoCard from "./bento-card";

export default function FeatureEight() {
    return (
        <BentoCard className="relative flex flex-col bg-blue-200 sm:col-span-2">
            <WideCard />
            <div className="mt-4">
                <div className="text-lg font-black text-blue-800">
                    Daily reminders
                </div>
                <p className="text-sm">
                    Our daily reminder helps you keep focused on your goals.
                </p>
            </div>
        </BentoCard>
    );
}
