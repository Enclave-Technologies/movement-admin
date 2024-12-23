import React from "react";

export const Tab = ({ label, onClick, isSelected, icon }) => {
    return (
        <div
            className={`hover:cursor-pointer flex-1 flex flex-row items-center justify-center py-4 gap-2 ${
                isSelected ? "bg-green-500 text-white" : "bg-white"
            }`}
            onClick={onClick}
        >
            {icon}
            <p className={`${isSelected ? "font-semibold" : ""}`}>{label}</p>
        </div>
    );
};
