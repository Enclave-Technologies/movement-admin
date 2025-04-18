"use client";

import { cn } from "@/lib/utils";
import BentoCard from "./bento-card";

// #region placeholder
function BoldCopy({
    text = "animata",
    className,
    textClassName,
    backgroundTextClassName,
}: {
    text: string;
    className?: string;
    textClassName?: string;
    backgroundTextClassName?: string;
}) {
    if (!text?.length) {
        return null;
    }

    return (
        <div
            className={cn(
                "group relative flex items-center justify-center bg-background px-2 py-2 md:px-6 md:py-4",
                className
            )}
        >
            <div
                className={cn(
                    "text-4xl font-black uppercase text-foreground/15 transition-all group-hover:opacity-50 md:text-8xl",
                    backgroundTextClassName
                )}
            >
                {text}
            </div>
            <div
                className={cn(
                    "text-md absolute font-black uppercase text-foreground transition-all group-hover:text-4xl md:text-3xl group-hover:md:text-8xl",
                    textClassName
                )}
            >
                {text}
            </div>
        </div>
    );
}

export default function FeatureFive() {
    return (
        <BentoCard className="flex flex-col items-center justify-center bg-zinc-300 sm:col-span-2">
            <BoldCopy
                text="EDU"
                className="bg-transparent"
                textClassName="text-zinc-800"
            />
        </BentoCard>
    );
}
