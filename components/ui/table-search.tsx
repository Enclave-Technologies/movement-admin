"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";

interface TableSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function TableSearch({
    value,
    onChange,
    placeholder = "Search...",
    className,
}: TableSearchProps) {
    const [inputValue, setInputValue] = useState(value);
    const [debouncedValue] = useDebounce(inputValue, 300);

    // Update the debounced value
    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue, onChange]);

    // Update local state when the external value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-8 pr-8"
            />
            {inputValue && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2 py-0"
                    onClick={() => {
                        setInputValue("");
                    }}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear</span>
                </Button>
            )}
        </div>
    );
}
