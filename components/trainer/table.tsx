import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { defaultProfileURL } from "@/configs/constants";
import Image from "next/image";

export function ClientTable({ clientList }: { clientList: any[] }) {
    return (
        <Table>
            <TableCaption>Clients under your program.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Gender</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clientList.map((client) => (
                    <TableRow key={client.invoice}>
                        <TableCell className="font-medium">
                            <Image
                                src={client.imageURL || defaultProfileURL}
                                height={30}
                                width={30}
                                alt={`${client.firstName} ${client.lastName}`}
                                className="rounded-full"
                            />
                        </TableCell>
                        <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell className="text-right uppercase">
                            {client.gender}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
