import React, { FC, useEffect, useRef, useState } from "react";
import { FaEdit, FaCopy, FaPlus, FaTrash } from "react-icons/fa";
import { ID } from "appwrite";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import TooltipButton from "../pure-components/TooltipButton";
import LoadingSpinner from "../LoadingSpinner";

const PhaseActions = ({
    phase,
    isEditingTitle,
    setIsEditingTitle,
    handleDeletePhase,
    handleCopyPhase,
    handleAddSession,
    opRunning,
}) => {
    if (opRunning) {
        return (
            <>
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="ml-2">
                        <LoadingSpinner className="h-5 w-5" />
                    </div>
                ))}
            </>
        );
    }
    return (
        <>
            <TooltipButton
                tooltip="Rename Phase"
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-green-500"
                onClick={() => {
                    setIsEditingTitle(true);
                }}
            >
                <FaEdit />
            </TooltipButton>
            <TooltipButton
                tooltip="Delete Phase"
                className="ml-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring focus:ring-red-500"
                onClick={handleDeletePhase}
            >
                <FaTrash />
            </TooltipButton>
            <TooltipButton
                tooltip="Duplicate Phase"
                className="ml-2 text-green-500 hover:text-green-900 focus:outline-none focus:ring focus:ring-green-500"
                onClick={() => {
                    handleCopyPhase(phase.phaseId);
                }}
            >
                <FaCopy />
            </TooltipButton>
            <TooltipButton
                tooltip="Add Session"
                className="ml-2 text-green-500 hover:text-green-900 focus:outline-none focus:ring focus:ring-green-500"
                onClick={() => {
                    handleAddSession();
                }}
            >
                <FaPlus />
            </TooltipButton>
        </>
    );
};

export default PhaseActions;
