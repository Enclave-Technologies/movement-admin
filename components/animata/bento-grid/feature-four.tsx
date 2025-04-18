"use client";

import Report from "../skeleton/report";
import BentoCard from "./bento-card";

export default function FeatureFour() {
    return (
        <BentoCard className="flex items-center gap-4 bg-lime-300 sm:col-span-2 md:flex-row-reverse">
            <div className="text-2xl font-black text-lime-800">
                Generate progress report
            </div>
            <div className="relative max-h-32 flex-shrink-0 overflow-hidden">
                <Report className="w-40 overflow-hidden border-none shadow-none hover:shadow-none" />
            </div>
        </BentoCard>
    );
}
