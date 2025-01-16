"use client";
import React, { useEffect, useState } from "react";

const DebouncedInput = ({
    value,
    onChange,
    placeholder,
    delay = 1000,
    className = "",
}) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        onChange(value);
    }, [value]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(localValue);
        }, delay);

        return () => clearTimeout(timeout);
    }, [localValue]);

    return (
        <input
            className={`placeholder:text-gray-500 text-sm ${className}`}
            value={localValue}
            placeholder={placeholder}
            onChange={(e) => {
                setLocalValue(e.target.value);
            }}
            ref={(input) => input && input.focus()}
        />
    );
};

export default DebouncedInput;
