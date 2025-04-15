import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col space-y-6 items-center">
        <div className="flex items-center justify-center mb-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground text-sm font-medium mb-4">
          Loading your workout data...
        </p>
        <div className="flex flex-col space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full rounded-md bg-primary/20 animate-pulse" />
          <div className="flex space-x-4 items-center">
            <div className="p-2 rounded-full bg-secondary/20 animate-pulse">
              <Dumbbell className="h-10 w-10 text-secondary" />
            </div>
            <div className="flex flex-col space-y-2 flex-1">
              <Skeleton className="h-4 w-full rounded bg-primary/20 animate-pulse" />
              <Skeleton className="h-4 w-3/4 rounded bg-secondary/20 animate-pulse" />
            </div>
          </div>
          <Skeleton className="h-8 w-full rounded-md bg-primary/20 animate-pulse" />
          <Skeleton className="h-24 w-full rounded-md bg-secondary/10 animate-pulse" />
          <div className="flex justify-center mt-6">
            <div className="h-4 w-4 rounded-full bg-primary animate-[bounce_0.6s_infinite] mx-1"></div>
            <div className="h-4 w-4 rounded-full bg-primary animate-[bounce_0.6s_infinite] mx-1" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-4 w-4 rounded-full bg-primary animate-[bounce_0.6s_infinite] mx-1" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
