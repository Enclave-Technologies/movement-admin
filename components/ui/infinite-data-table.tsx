"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    Row,
    Table as TableInstance,
} from "@tanstack/react-table";
// Import types but don't use the function directly
import type { VirtualItem } from "@tanstack/react-virtual";

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
    rowVirtualizer: {
        getVirtualItems: () => VirtualItem[];
        getTotalSize: () => number;
        measureElement: (element: Element | null) => void;
        scrollToIndex: (index: number) => void;
    };
    tableContainerRef: React.RefObject<HTMLDivElement>;
    table: TableInstance<TData>;
    rows: Row<TData>[];
    loadMoreRef?: React.RefObject<HTMLDivElement>;
    height?: string;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
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
    height = "calc(100vh - 200px)",
    onScroll,
}: InfiniteDataTableProps<TData, TValue>) {
    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
        <div
            ref={tableContainerRef}
            className={cn(
                "relative overflow-auto rounded-md border",
                className
            )}
            style={{ height }} // Allow customizable height
            onScroll={onScroll} // Allow custom scroll handler
        >
            <Table style={{ display: "grid" }}>
                <TableHeader
                    className="sticky top-0 z-10 bg-background"
                    style={{
                        display: "grid",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                    }}
                >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            style={{ display: "flex", width: "100%" }}
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    style={{
                                        display: "flex",
                                        width:
                                            header.getSize() !== 0
                                                ? header.getSize()
                                                : "auto",
                                    }}
                                >
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
                <TableBody
                    style={{
                        display: "grid",
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: "relative",
                    }}
                >
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
                            {virtualItems.map((virtualRow: VirtualItem) => {
                                const row = rows[virtualRow.index];
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-index={virtualRow.index}
                                        ref={(node) =>
                                            rowVirtualizer.measureElement(node)
                                        }
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
                                        style={{
                                            display: "flex",
                                            position: "absolute",
                                            transform: `translateY(${virtualRow.start}px)`,
                                            width: "100%",
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                style={{
                                                    display: "flex",
                                                    width:
                                                        cell.column.getSize() !==
                                                        0
                                                            ? cell.column.getSize()
                                                            : "auto",
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </>
                    )}
                    {isLoading && rows.length > 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-12 text-center text-muted-foreground"
                            >
                                Loading more...
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Sentinel element for infinite scroll */}
            {hasMore && loadMoreRef && (
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
