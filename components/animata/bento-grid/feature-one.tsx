"use client";
import React from "react";

import Ticker from "@/components/animata/text/ticker";
import BentoCard from "./bento-card";

export default function FeatureOne() {
    return (
        <BentoCard className="flex flex-col bg-yellow-300">
            <div className="font-bold text-yellow-700">Highly rated</div>
            <div className="mt-auto flex justify-end">
                <div className="text-4xl font-black text-black/60 md:text-7xl">
                    <Ticker value="4.8" />
                </div>{" "}
                <sup className="text-xl text-yellow-700">★</sup>
            </div>
        </BentoCard>
    );
}
