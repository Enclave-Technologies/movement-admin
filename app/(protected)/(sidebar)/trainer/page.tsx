import { authenticated_or_login } from "@/actions/appwrite_actions";
import { getClientsManagedByUserPaginated } from "@/actions/client_actions";
import { getCoachById } from "@/actions/coach_actions";
import { checkGuestApproval } from "@/lib/auth-utils";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { InfiniteTable } from "./infinite-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default async function Trainer({
    searchParams,
}: {
    searchParams: { id?: string };
}) {
    await checkGuestApproval();

    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;

    const result = await authenticated_or_login(session);

    if (result && "error" in result) {
        console.error("Error in Trainer:", result.error);
        redirect("/login?error=user_fetch_error");
    }

    if (!result || (!("error" in result) && !result)) {
        redirect("/login");
    }

    const userId = searchParams.id || result.$id;

    // Get trainer details and clients
    const trainerData = await getCoachById(userId);
    const initialResult = await getClientsManagedByUserPaginated(userId, 0, 10);

    if (!trainerData) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Trainer Not Found</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const registrationDate = trainerData.registrationDate
        ? new Date(trainerData.registrationDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Unknown";

    // Calculate time since registration
    let timeWithMovement = "";
    if (trainerData.registrationDate) {
        const now = new Date();
        const regDate = new Date(trainerData.registrationDate);
        const diffTime = Math.abs(now.getTime() - regDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            timeWithMovement = `${diffDays} days`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            timeWithMovement = `${months} month${months > 1 ? "s" : ""}`;
        } else {
            const years = Math.floor(diffDays / 365);
            timeWithMovement = `${years} year${years > 1 ? "s" : ""}`;
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const formatGender = (gender: string | null) => {
        if (!gender) return "Not specified";
        return (
            gender.charAt(0).toUpperCase() + gender.slice(1).replace("-", " ")
        );
    };

    return (
        <div className="container mx-auto py-2 md:py-6">
            <Card className="mb-6">
                <CardHeader className="pb-0">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={trainerData.imageUrl || ""}
                                    alt={trainerData.fullName}
                                />
                                <AvatarFallback>
                                    {getInitials(trainerData.fullName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl mb-1">
                                    {trainerData.fullName}
                                </CardTitle>
                                <Badge>Trainer</Badge>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                            <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <Separator className="my-4" />
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <div className="text-sm font-medium">Email</div>
                            <div className="text-sm text-muted-foreground">
                                {trainerData.email || "- -"}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <div className="text-sm font-medium">Phone</div>
                            <div className="text-sm text-muted-foreground">
                                {trainerData.phone || "- -"}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <div className="text-sm font-medium">Gender</div>
                            <div className="text-sm text-muted-foreground">
                                {formatGender(trainerData.gender)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <div className="text-sm font-medium">Joined</div>
                            <div className="text-sm text-muted-foreground">
                                {registrationDate}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {timeWithMovement} with Movement
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-xl font-bold mb-4">Clients</h2>

            <Suspense fallback={<TableSkeleton />}>
                <InfiniteTable
                    initialData={initialResult}
                    fetchDataFn={getClientsManagedByUserPaginated}
                    columns={columns}
                    queryId={userId}
                />
            </Suspense>
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Skeleton className="h-10 w-[300px]" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-[100px]" />
                    <Skeleton className="h-9 w-[100px]" />
                </div>
            </div>

            <div className="rounded-md border">
                <div className="h-[600px] w-full relative">
                    <Skeleton className="absolute inset-0" />
                </div>
            </div>
        </div>
    );
}
