"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/lib/utils"

// Define the client type to match what comes from the database
export type Client = {
  userId: string
  fullName: string
  email: string | null
  registrationDate: Date
  phone: string | null
  gender: string | null
  assignedDate: Date
  notes: string | null
  imageUrl: string | null
  relationshipId: string
  idealWeight?: number | null
  dob?: Date | null
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      const value = row.getValue("fullName") as string
      return <div className="font-medium">{value || "—"}</div>
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const value = row.getValue("email") as string
      return <div>{value || "—"}</div>
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const value = row.getValue("phone") as string
      return <div>{value || "—"}</div>
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const value = row.getValue("gender") as string
      return <div>{value || "—"}</div>
    },
  },
  {
    accessorKey: "registrationDate",
    header: "Registered",
    cell: ({ row }) => {
      const value = row.getValue("registrationDate") as Date
      return <div>{formatDate(value)}</div>
    },
  },
  {
    accessorKey: "assignedDate",
    header: "Assigned",
    cell: ({ row }) => {
      const value = row.getValue("assignedDate") as Date
      return <div>{formatDate(value)}</div>
    },
  },
]
