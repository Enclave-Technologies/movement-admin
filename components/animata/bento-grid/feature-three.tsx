"use client";
import { Bot } from "lucide-react";
import BentoCard from "./bento-card";
import TypingText from "../text/typing-text";

export default function FeatureThree() {
    return (
        <BentoCard className="flex flex-col bg-orange-300">
            <Bot className="size-8 md:size-12" />
            <strong className="mt-1 inline-block text-sm">Integrated AI</strong>

            <div className="mt-auto">
                <div className="text-sm font-medium">What is 4 times 4?</div>
                <div className="font-semibold">
                    <TypingText
                        text="4 times 4 is 16"
                        waitTime={2000}
                        alwaysVisibleCount={0}
                    />
                </div>
            </div>
        </BentoCard>
    );
}
