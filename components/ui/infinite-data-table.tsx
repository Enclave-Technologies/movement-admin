"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    Row,
    Table as TableInstance,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface InfiniteDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    hasMore?: boolean;
    isLoading?: boolean;
    emptyMessage?: string;
    className?: string;
    rowClassName?: (row: Row<TData>) => string;
    onRowClick?: (row: Row<TData>) => void;
    rowVirtualizer: ReturnType<typeof useVirtualizer>;
    tableContainerRef: React.RefObject<HTMLDivElement>;
    table: TableInstance<TData>;
    rows: Row<TData>[];
    loadMoreRef: React.RefObject<HTMLDivElement>;
}

export function InfiniteDataTable<TData, TValue>({
    columns,
    hasMore = false,
    isLoading = false,
    emptyMessage = "No data found.",
    className,
    rowClassName,
    onRowClick,
    rowVirtualizer,
    tableContainerRef,
    table,
    rows,
    loadMoreRef,
}: InfiniteDataTableProps<TData, TValue>) {
    const virtualItems = rowVirtualizer.getVirtualItems();

    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;

    const paddingBottom =
        virtualItems.length > 0
            ? rowVirtualizer.getTotalSize() -
              virtualItems[virtualItems.length - 1].end
            : 0;

    return (
        <div
            ref={tableContainerRef}
            className={cn(
                "relative overflow-auto rounded-md border",
                className
            )}
            style={{ height: "calc(100vh - 200px)" }} // Because inline styles takes the most precedence
        >
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {rows.length === 0 && !isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {paddingTop > 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        style={{
                                            height: `${paddingTop}px`,
                                            padding: 0,
                                        }}
                                    />
                                </TableRow>
                            )}
                            {virtualItems.map((virtualRow) => {
                                const row = rows[virtualRow.index];
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                        className={cn(
                                            rowClassName
                                                ? rowClassName(row)
                                                : "",
                                            onRowClick ? "cursor-pointer" : ""
                                        )}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                            {paddingBottom > 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        style={{
                                            height: `${paddingBottom}px`,
                                            padding: 0,
                                        }}
                                    />
                                </TableRow>
                            )}
                        </>
                    )}
                    {isLoading && rows.length > 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-12 text-center text-muted-foreground"
                            >
                                Loading...
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Sentinel element for infinite scroll */}
            {hasMore && (
                <div
                    ref={loadMoreRef}
                    className="h-20 w-full flex items-center justify-center"
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                    }}
                >
                    {isLoading ? (
                        <div className="text-sm text-muted-foreground">
                            Loading more...
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Scroll for more
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
