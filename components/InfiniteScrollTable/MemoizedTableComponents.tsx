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

const MemoizedHeader = memo(({ header, isSorted }: MemoizedHeaderProps) => {
    return (
        <div
            {...{
                className: `flex items-center gap-2 ${
                    header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                }`,
                onClick: header.column.getToggleSortingHandler(),
            }}
        >
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
    );
});

MemoizedHeader.displayName = "MemoizedHeader";

const MemoizedCell = memo(({ cell }: MemoizedCellProps) => (
    <td
        style={{
            display: "flex",
            width: cell.column.getSize(),
        }}
        className={`p-1 whitespace-normal text-sm bg-inherit h-full items-center justify-left ${
            cell.column.columnDef.meta?.className ?? ""
        } `}
    >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
));

MemoizedCell.displayName = "MemoizedCell";

export { MemoizedHeader, MemoizedCell };
