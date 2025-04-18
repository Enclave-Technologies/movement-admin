import { cn } from "@/lib/utils";

export default function BentoCard({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "relative h-full w-full overflow-hidden rounded-2xl p-4",
                className
            )}
        >
            {children}
        </div>
    );
}
