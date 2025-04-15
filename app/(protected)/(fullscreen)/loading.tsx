import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col space-y-6 items-center">
                <div className="flex items-center justify-center mb-2">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="text-muted-foreground text-sm font-medium mb-4">Loading content...</p>
                <div className="flex flex-col space-y-4 w-full max-w-md">
                    <Skeleton className="h-12 w-full bg-primary/20" />
                    <div className="flex space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-secondary/20" />
                        <div className="flex flex-col space-y-2 flex-1">
                            <Skeleton className="h-4 w-full bg-primary/20" />
                            <Skeleton className="h-4 w-3/4 bg-secondary/20" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-full bg-primary/20" />
                    <Skeleton className="h-24 w-full bg-secondary/10" />
                </div>
            </div>
        </div>
    );
}
