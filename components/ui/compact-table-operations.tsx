"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CompactTableOperationsProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    onSortChange?: (columnId: string, desc: boolean) => void;
    onFilterChange?: (columnId: string, value: string) => void;
    onApplyClick?: () => void;
    showNewButton?: boolean;
    onNewClick?: () => void;
    className?: string;
}

export default function CompactTableOperations<TData, TValue>({
    columns,
    globalFilter,
    setGlobalFilter,
    onSortChange,
    onFilterChange,
    onApplyClick,
    showNewButton = false,
    onNewClick,
    className = "",
}: CompactTableOperationsProps<TData, TValue>) {
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [selectedFilterColumn, setSelectedFilterColumn] = useState<
        string | null
    >(null);
    const [filterValue, setFilterValue] = useState("");
    const [selectedSortColumn, setSelectedSortColumn] = useState<string | null>(
        null
    );
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

    // Count active filters/sorts for badges
    const hasActiveFilter = selectedFilterColumn && filterValue;
    const hasActiveSort = !!selectedSortColumn;
    const hasActiveSearch = !!globalFilter;
    const hasAnyActive = hasActiveFilter || hasActiveSort || hasActiveSearch;

    const toggleSearch = () => {
        setSearchExpanded(!searchExpanded);
        if (!searchExpanded) {
            // Focus the search input when expanded
            setTimeout(() => {
                const searchInput = document.getElementById("search-input");
                if (searchInput) searchInput.focus();
            }, 100);
        }
    };

    const clearSearch = () => {
        setGlobalFilter("");
    };

    const handleFilterColumnSelect = (columnId: string) => {
        setSelectedFilterColumn(columnId);
    };

    const handleSortColumnSelect = (columnId: string) => {
        if (selectedSortColumn === columnId) {
            // Toggle direction if same column is selected
            const newDirection = sortDirection === "asc" ? "desc" : "asc";
            setSortDirection(newDirection);
            onSortChange?.(columnId, newDirection === "desc");
        } else {
            setSelectedSortColumn(columnId);
            setSortDirection("asc");
            onSortChange?.(columnId, false);
        }
    };

    const toggleSortDirection = () => {
        const newDirection = sortDirection === "asc" ? "desc" : "asc";
        setSortDirection(newDirection);
        if (selectedSortColumn) {
            onSortChange?.(selectedSortColumn, newDirection === "desc");
        }
    };

    const clearFilter = () => {
        setSelectedFilterColumn(null);
        setFilterValue("");
        setFilterPopoverOpen(false);
        onFilterChange?.("", "");
    };

    const clearSort = () => {
        setSelectedSortColumn(null);
        onSortChange?.("", false);
    };

    const applyFilter = () => {
        if (selectedFilterColumn && filterValue) {
            onFilterChange?.(selectedFilterColumn, filterValue);
            setFilterPopoverOpen(false);
        }
    };

    const clearAll = () => {
        setSelectedFilterColumn(null);
        setFilterValue("");
        setSelectedSortColumn(null);
        setSortDirection("asc");
        setGlobalFilter("");
        setFilterPopoverOpen(false);
        
        // Clear URL parameters
        const newSearchParams = new URLSearchParams();
        const pathname = window.location.pathname;
        window.history.replaceState(null, '', `${pathname}?${newSearchParams}`);

        // Notify parent components
        onFilterChange?.("", "");
        onSortChange?.("", false);
        
        // Force a refresh of the table data
        onApplyClick?.();
    };

    return (
        <div className={cn("flex flex-col space-y-2", className)}>
            {/* Toolbar - Always visible */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto flex-nowrap no-scrollbar h-12">
                {/* Left side - Action buttons and active filters/sorts */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Search button/input */}
                    {searchExpanded ? (
                        <div className="flex items-center">
                            <div className="relative">
                                <Input
                                    id="search-input"
                                    placeholder="Search..."
                                    className="h-8 w-[200px] pr-8"
                                    value={globalFilter}
                                    onChange={(e) =>
                                        setGlobalFilter(e.target.value)
                                    }
                                />
                                {globalFilter && (
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={clearSearch}
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={toggleSearch}
                                className="ml-1 h-8 w-8"
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="p-2 relative rounded-md hover:bg-muted"
                            onClick={toggleSearch}
                        >
                            <Search size={18} />
                            {hasActiveSearch && (
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                                    1
                                </Badge>
                            )}
                        </button>
                    )}

                    <Popover
                        open={filterPopoverOpen}
                        onOpenChange={setFilterPopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="p-2 relative rounded-md hover:bg-muted"
                            >
                                <Filter size={18} />
                                {hasActiveFilter && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                                        1
                                    </Badge>
                                )}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-3" align="start">
                            <div className="space-y-3">
                                <div className="text-sm font-medium">
                                    Filter by column
                                </div>

                                {!selectedFilterColumn ? (
                                    <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                                        {columns.length > 0 ? (
                                            columns.map((column) => {
                                                // Extract column name from header or accessorKey
                                                const columnId =
                                                    typeof column.header ===
                                                    "string"
                                                        ? column.header
                                                        : "accessorKey" in
                                                          column
                                                        ? String(
                                                              column.accessorKey
                                                          )
                                                        : column.id || "Column";

                                                return (
                                                    <Button
                                                        key={`filter-${columnId}`}
                                                        variant="outline"
                                                        size="sm"
                                                        className="justify-start font-normal"
                                                        onClick={() =>
                                                            handleFilterColumnSelect(
                                                                columnId
                                                            )
                                                        }
                                                    >
                                                        {columnId}
                                                    </Button>
                                                );
                                            })
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                No columns available
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="font-normal"
                                            >
                                                {selectedFilterColumn}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() =>
                                                    setSelectedFilterColumn(
                                                        null
                                                    )
                                                }
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>

                                        <div className="relative">
                                            <Input
                                                id="filter-input"
                                                placeholder={`Filter by ${selectedFilterColumn}...`}
                                                className="h-8 pr-8"
                                                value={filterValue}
                                                onChange={(e) =>
                                                    setFilterValue(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        applyFilter();
                                                    }
                                                }}
                                                autoFocus
                                            />
                                            {filterValue && (
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    onClick={() =>
                                                        setFilterValue("")
                                                    }
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setFilterPopoverOpen(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={applyFilter}
                                                disabled={!filterValue}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="p-2 relative rounded-md hover:bg-muted"
                            >
                                <ArrowUpDown size={18} />
                                {hasActiveSort && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                                        1
                                    </Badge>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {columns.length > 0 ? (
                                columns.map((column) => {
                                    // Extract column name from header or accessorKey
                                    const columnId =
                                        typeof column.header === "string"
                                            ? column.header
                                            : "accessorKey" in column
                                            ? String(column.accessorKey)
                                            : column.id || "Column";

                                    return (
                                        <DropdownMenuItem
                                            key={`sort-${columnId}`}
                                            onClick={() =>
                                                handleSortColumnSelect(columnId)
                                            }
                                        >
                                            {columnId}
                                        </DropdownMenuItem>
                                    );
                                })
                            ) : (
                                <DropdownMenuItem disabled>
                                    No columns available
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Active filters/sorts chips - inline with toolbar */}
                    {hasActiveFilter && (
                        <div className="flex items-center bg-primary text-primary-foreground rounded-full h-8 px-3 text-xs">
                            <span className="font-medium mr-1">Filter:</span>
                            <span className="truncate max-w-[120px]">
                                {selectedFilterColumn} = {filterValue}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-1 -mr-1 text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent rounded-full"
                                onClick={clearFilter}
                            >
                                <X size={10} />
                            </Button>
                        </div>
                    )}

                    {hasActiveSort && (
                        <div className="flex items-center bg-primary text-primary-foreground rounded-full h-8 px-3 text-xs">
                            <span className="font-medium mr-1">Sort:</span>
                            <button
                                type="button"
                                className="flex items-center cursor-pointer hover:underline truncate max-w-[120px]"
                                onClick={toggleSortDirection}
                                title="Click to toggle sort direction"
                            >
                                <span>
                                    {selectedSortColumn} (
                                    {sortDirection === "asc" ? "asc" : "desc"})
                                </span>
                                <ArrowUpDown
                                    size={10}
                                    className="ml-1 flex-shrink-0"
                                />
                            </button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-1 -mr-1 text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent rounded-full flex-shrink-0"
                                onClick={clearSort}
                            >
                                <X size={10} />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right side - Action buttons */}
                <div className="flex items-center gap-2">
                    {/* Apply button - always visible */}
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="h-8"
                        onClick={onApplyClick}
                    >
                        Apply
                    </Button>

                    {/* Clear All button - only shown when there are active filters/sorts */}
                    {hasAnyActive && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={clearAll}
                        >
                            <X size={16} className="mr-1" />
                            Clear All
                        </Button>
                    )}

                    {/* New button - only shown if enabled, positioned at the very right */}
                    {showNewButton && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={onNewClick}
                        >
                            New
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
