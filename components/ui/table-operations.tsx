"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, ArrowUpDown, X, Check, Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "./button";

interface TableOperationsProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    onNewClick?: () => void;
    showNewButton?: boolean;
    showFilterButton?: boolean;
    showSortButton?: boolean;
    onSortChange?: (columnId: string, desc: boolean) => void;
    onFilterChange?: (columnId: string, value: string) => void;
    className?: string;
}

export default function TableOperations<TData, TValue>({
    columns,
    globalFilter,
    setGlobalFilter,
    onNewClick,
    showNewButton = true,
    showFilterButton = true,
    showSortButton = true,
    onSortChange,
    onFilterChange,
    className = "",
}: TableOperationsProps<TData, TValue>) {
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [selectedFilterColumn, setSelectedFilterColumn] = useState<
        string | null
    >(null);
    const [filterValue, setFilterValue] = useState("");
    const [selectedSortColumn, setSelectedSortColumn] = useState<string | null>(
        null
    );
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
        onFilterChange?.("", "");
    };

    const clearSort = () => {
        setSelectedSortColumn(null);
        onSortChange?.("", false);
    };

    const applyFilter = () => {
        if (selectedFilterColumn && filterValue) {
            onFilterChange?.(selectedFilterColumn, filterValue);
        }
    };

    const clearAll = () => {
        setSelectedFilterColumn(null);
        setFilterValue("");
        setSelectedSortColumn(null);
        setSortDirection("asc");
        setGlobalFilter("");
        onFilterChange?.("", "");
        onSortChange?.("", false);
    };

    return (
        <div className={`mb-4 border-b border-gray-200 pb-4 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side - Filter display area */}
                {showFilterButton && (
                    <div className="min-h-[80px] flex items-center">
                        <div className="w-full">
                            {selectedFilterColumn ? (
                                <div className="space-y-1">
                                    <label
                                        htmlFor="filter-input"
                                        className="text-sm font-medium"
                                    >
                                        Filter by {selectedFilterColumn}
                                    </label>
                                    <div className="flex items-center">
                                        <Input
                                            id="filter-input"
                                            placeholder="Enter value..."
                                            className="h-8"
                                            value={filterValue}
                                            onChange={(e) =>
                                                setFilterValue(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    applyFilter();
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={clearFilter}
                                            className="ml-1"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    No filters applied
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Right side - Sort display area */}
                {showSortButton && (
                    <div className="min-h-[80px] flex items-center">
                        <div className="w-full">
                            {selectedSortColumn ? (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">
                                        Sort by {selectedSortColumn}
                                    </label>
                                    <div className="flex items-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-8 flex items-center gap-1"
                                            onClick={toggleSortDirection}
                                        >
                                            {sortDirection === "asc" ? (
                                                <>
                                                    <ArrowUpDown className="h-4 w-4 rotate-180" />
                                                    <span>Ascending</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowUpDown className="h-4 w-4" />
                                                    <span>Descending</span>
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={clearSort}
                                            className="ml-1 h-8 w-8"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    No sorting applied
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Toolbar - Always visible */}
            <div className="flex flex-wrap items-center justify-between mt-4">
                {/* Left side - Action buttons */}
                <div className="flex items-center gap-2">
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
                            className="p-2 relative"
                            onClick={toggleSearch}
                        >
                            <Search size={18} />
                            {globalFilter && (
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                                    1
                                </Badge>
                            )}
                        </button>
                    )}

                    {showFilterButton && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="p-2 relative">
                                    <Filter size={18} />
                                    {selectedFilterColumn && (
                                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                                            1
                                        </Badge>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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
                                                key={`filter-${columnId}`}
                                                onClick={() =>
                                                    handleFilterColumnSelect(
                                                        columnId
                                                    )
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
                    )}

                    {showSortButton && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="p-2 relative">
                                    <ArrowUpDown size={18} />
                                    {selectedSortColumn && (
                                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                                            1
                                        </Badge>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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
                                                    handleSortColumnSelect(
                                                        columnId
                                                    )
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
                    )}
                </div>

                {/* Right side - Submit and New buttons */}
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="ml-2 h-10"
                        onClick={clearAll}
                    >
                        <X size={18} className="mr-1" />
                        Clear All
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="ml-2 h-10"
                        onClick={() => {
                            applyFilter();
                        }}
                    >
                        <Check size={18} className="mr-1" />
                        Apply
                    </Button>

                    {showNewButton && onNewClick && (
                        <Button
                            type="button"
                            onClick={onNewClick}
                            className="ml-2 h-10"
                        >
                            <Plus size={18} className="mr-1" />
                            New
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
