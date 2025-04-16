"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
    Row,
    OnChangeFn,
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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
    emptyMessage?: string;
    className?: string;
    rowClassName?: (row: Row<TData>) => string;
    onRowClick?: (row: Row<TData>) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    loadMore,
    hasMore = false,
    isLoading = false,
    emptyMessage = "No data found.",
    className,
    rowClassName,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting as OnChangeFn<SortingState>,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 45, // Approximate row height
        overscan: 10,
    });

    // Infinite scroll using IntersectionObserver
    React.useEffect(() => {
        if (!hasMore || isLoading || !loadMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: "200px" }
        );

        const element = tableContainerRef.current;
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [hasMore, isLoading, loadMore]);

    const paddingTop =
        rowVirtualizer.getVirtualItems().length > 0
            ? rowVirtualizer.getVirtualItems()[0].start
            : 0;

    const paddingBottom =
        rowVirtualizer.getVirtualItems().length > 0
            ? rowVirtualizer.getTotalSize() -
              rowVirtualizer.getVirtualItems()[
                  rowVirtualizer.getVirtualItems().length - 1
              ].end
            : 0;

    return (
        <div
            ref={tableContainerRef}
            className={cn(
                "relative overflow-auto rounded-md border",
                className
            )}
            style={{ height: "calc(100vh - 200px)" }}
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
                                <tr>
                                    <td style={{ height: `${paddingTop}px` }} />
                                </tr>
                            )}
                            {rowVirtualizer
                                .getVirtualItems()
                                .map((virtualRow) => {
                                    const row = rows[virtualRow.index];
                                    return (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                "selected"
                                            }
                                            className={cn(
                                                rowClassName
                                                    ? rowClassName(row)
                                                    : "",
                                                onRowClick
                                                    ? "cursor-pointer"
                                                    : ""
                                            )}
                                            onClick={() => onRowClick?.(row)}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    );
                                })}
                            {paddingBottom > 0 && (
                                <tr>
                                    <td
                                        style={{ height: `${paddingBottom}px` }}
                                    />
                                </tr>
                            )}
                        </>
                    )}
                    {isLoading && (
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
        </div>
    );
}
