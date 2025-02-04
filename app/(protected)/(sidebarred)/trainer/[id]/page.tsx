import EditTrainer from "@/components/trainer/editTrainer";
import { ClientTable } from "@/components/trainer/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { defaultProfileURL } from "@/configs/constants";
import { fetchUserDetails } from "@/server_functions/auth";
import { trainerDetails } from "@/server_functions/trainerFunctions";
import { formatDate } from "@/utils/dateUtils";
import Image from "next/image";

export default async function ProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const myInfo = await fetchUserDetails();
    const { trainerDeets: trainerDt, clientInfo } = await trainerDetails(
        params.id
    );

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-20 h-20">
                                    {/* <AvatarImage
                                        src={`${trainerDt.imageURL}`}
                                        alt="User Avatar"
                                    />
                                    <AvatarFallback>
                                        <AvatarImage src={defaultProfileURL} />
                                    </AvatarFallback> */}
                                    <Image
                                        src={
                                            trainerDt.imageURL ||
                                            defaultProfileURL
                                        } // Provide a default placeholder
                                        width={32}
                                        height={32}
                                        alt="User Avatar"
                                        className="rounded-full w-20 h-20"
                                    />
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {trainerDt.firstName}{" "}
                                        {trainerDt.lastName}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {trainerDt.jobTitle}
                                    </p>
                                </div>
                            </div>
                            {myInfo.team.includes("Admins") && (
                                <EditTrainer trainerDetails={trainerDt} />
                            )}
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        <div className="space-y-4">
                            <ClientTable clientList={clientInfo} />
                        </div>
                    </CardContent>
                    <CardFooter></CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">
                            Additional Info
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-wrap">
                            <div>
                                <h3 className="font-medium">Email</h3>
                                <p className="text-muted-foreground break-words">
                                    {trainerDt.email}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Phone</h3>
                                <p className="text-muted-foreground break-words">
                                    {trainerDt.phone}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Gender</h3>
                                <p className="text-muted-foreground whitespace-normal">
                                    {trainerDt.gender === "m" ? "Man" : "Woman"}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Joined</h3>
                                <p className="text-muted-foreground whitespace-normal">
                                    {formatDate(trainerDt.$createdAt)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
