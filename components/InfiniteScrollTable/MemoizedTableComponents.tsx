import React, { memo } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { flexRender } from "@tanstack/react-table";

// Define prop types for MemoizedHeader
interface MemoizedHeaderProps {
    header: any; // Replace 'any' with the appropriate type
    isSorted: any;
}

// Define prop types for MemoizedCell
interface MemoizedCellProps {
    cell: any; // Replace 'any' with the appropriate type
}

const MemoizedHeader = memo(({ header, isSorted }: MemoizedHeaderProps) => (
    <div className="flex items-center gap-2">
        {flexRender(header.column.columnDef.header, header.getContext())}
        {isSorted !== null &&
            (isSorted === "asc" ? (
                <FaChevronUp />
            ) : isSorted === "desc" ? (
                <FaChevronDown />
            ) : (
                ""
            ))}
    </div>
));

MemoizedHeader.displayName = "MemoizedHeader";

const MemoizedCell = memo(({ cell }: MemoizedCellProps) => (
    <td className={`flex w-[${cell.column.getSize()}] p-3 text-gray-700`}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
));

MemoizedCell.displayName = "MemoizedCell";

export { MemoizedHeader, MemoizedCell };
