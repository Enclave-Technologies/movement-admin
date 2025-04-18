"use client";

import BentoCard from "./bento-card";

export default function FeatureSeven() {
    return (
        <BentoCard className="flex flex-col gap-2 bg-rose-300">
            <div className="w-full -rotate-1 rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white md:-rotate-3">
                Javascript
            </div>
            <div className="w-full rotate-1 rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white md:rotate-3">
                ReactJS
            </div>
            <div className="w-full rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white">
                NextJS
            </div>
        </BentoCard>
    );
}
