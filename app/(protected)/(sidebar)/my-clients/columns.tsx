"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, UserX } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

// Define the client type to match what comes from the database
export type Client = {
    userId: string;
    fullName: string;
    email: string | null;
    registrationDate: Date;
    phone: string | null;
    gender: string | null;
    assignedDate: Date;
    notes: string | null;
    imageUrl: string | null;
    relationshipId: string;
    idealWeight?: number | null;
    dob?: Date | null;
    age?: number | null;
    trainerName?: string | null;
};

// Function to get initials from a name
function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
}

// Component for the Actions cell
function ActionsCell({ userId }: { userId: string }) {
    const handleViewProfile = () => {
        // TODO: Implement view profile logic, e.g. navigate to profile page
        console.log(`View profile for user ${userId}`);
    };

    const handleDeleteUser = () => {
        // TODO: Implement delete user logic, e.g. API call with confirmation
        console.log(`Delete user ${userId}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewProfile}>
                    <Eye className="mr-2 h-4 w-4" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteUser}>
                    <UserX className="mr-2 h-4 w-4" /> Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<Client>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                    className="h-4 w-4"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="h-4 w-4"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: "fullName",
        header: () => <div>Full Name</div>,
        cell: ({ row }) => {
            const value = row.getValue("fullName") as string;
            const imageUrl = row.original.imageUrl;

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={imageUrl || undefined} alt={value} />
                        <AvatarFallback>{getInitials(value)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{value || "—"}</div>
                </div>
            );
        },
        size: 250,
    },
    {
        accessorKey: "email",
        header: () => <div>Email</div>,
        cell: ({ row }) => {
            const value = row.getValue("email") as string;
            return <div className="truncate max-w-[200px]">{value || "—"}</div>;
        },
        size: 200,
    },
    {
        accessorKey: "registrationDate",
        header: () => <div>Member Since</div>,
        cell: ({ row }) => {
            const value = row.getValue("registrationDate") as Date;
            return <div className="text-center">{formatDate(value)}</div>;
        },
        size: 120,
    },
    {
        accessorKey: "phone",
        header: () => <div>Phone</div>,
        cell: ({ row }) => {
            const value = row.getValue("phone") as string;
            return <div className="text-center">{value || "—"}</div>;
        },
        size: 120,
    },
    {
        accessorKey: "gender",
        header: () => <div>Gender</div>,
        cell: ({ row }) => {
            const value = row.getValue("gender") as string | null;
            let display = "—";
            let icon = "";
            let variant: "default" | "secondary" | "destructive" | "outline" =
                "outline";

            if (value) {
                switch (value.toLowerCase()) {
                    case "male":
                    case "m":
                        display = "M";
                        icon = "♂️";
                        variant = "default";
                        break;
                    case "female":
                    case "f":
                        display = "F";
                        icon = "♀️";
                        variant = "secondary";
                        break;
                    case "nb":
                    case "non-binary":
                        display = "NB";
                        icon = "⚧";
                        variant = "outline";
                        break;
                    default:
                        display = "N/A";
                        icon = "—";
                        variant = "outline";
                }
            }

            return (
                <div className="flex justify-center">
                    <Badge variant={variant} className="font-normal">
                        <span aria-label={display} title={display}>
                            {icon} {display}
                        </span>
                    </Badge>
                </div>
            );
        },
        size: 80,
    },
    {
        accessorKey: "age",
        header: () => <div>Age</div>,
        cell: ({ row }) => {
            const value = row.getValue("age") as number | null;
            const dob = row.original.dob;

            // Calculate age if it's not provided but dob is available
            let age = value;
            if (age === undefined && dob) {
                const today = new Date();
                const birthDate = new Date(dob);
                age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (
                    m < 0 ||
                    (m === 0 && today.getDate() < birthDate.getDate())
                ) {
                    age--;
                }
            }

            return (
                <div className="text-center">
                    {age !== null && age !== undefined ? age : "—"}
                </div>
            );
        },
        size: 60,
    },
    {
        accessorKey: "trainerName",
        header: () => <div>Trainer</div>,
        cell: ({ row }) => {
            const value = row.getValue("trainerName") as string;
            return <div className="text-center">{value || "—"}</div>;
        },
        size: 120,
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const userId = row.original.userId;
            return (
                <div className="flex justify-center">
                    <ActionsCell userId={userId} />
                </div>
            );
        },
        size: 80,
    },
];
