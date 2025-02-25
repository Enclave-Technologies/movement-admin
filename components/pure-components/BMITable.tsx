"use client";
import React, { useState } from "react";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import Spinner from "../Spinner";
import LoadingSpinner from "../LoadingSpinner";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";

const BMITable = ({
    headerColumns,
    data,
    emptyText,
    handleDelete,
    buttonLoading,
    editingRowId,
    editedData,
    handleInputChange,
    handleUpdateRow,
    handleEditRow
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null); // New state variable
    

    const confirmDeletion = () => {
        handleDelete(rowToDelete); // Perform delete
        setShowDeleteConfirm(false); // Close dialog
        setRowToDelete(null); // Reset rowToDelete
    };

    const cancelDeletePhase = () => {
        setShowDeleteConfirm(false); // Just close the dialog
        setRowToDelete(null); // Reset rowToDelete
    };

    const handleDeletion = (rowId) => {
        setRowToDelete(rowId); // Store the ID of the row to delete
        setShowDeleteConfirm(true); // Show confirmation dialog
    };

    if (data.length === 0)
        return (
            <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
                <p className="text-gray-500 text-sm font-medium capitalize">
                    {emptyText}
                </p>
                <p className="text-gray-400 text-xs mt-1 capitalize">
                    Click &ldquo;Add&rdquo; to get started
                </p>
            </div>
        );

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left rounded-md overflow-x-auto">
                <thead>
                    <tr className="bg-gray-200 text-black">
                        {headerColumns.map((column, index) => (
                            <th
                                key={index}
                                className="text-xs capitalize font-bold pl-5 pr-4 h-8  whitespace-nowrap"
                            >
                                {column}
                            </th>
                        ))}
                        <th className="sticky right-0 bg-gray-200 z-20 px-2 py-2 text-xs border-l-[1px] border-gray-500 flex justify-center">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="border-t-0 border-white">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`${
                                !(rowIndex % 2) ? "bg-white" : "bg-gray-100"
                            } h-14 touch-action-none`}
                        >
                            {showDeleteConfirm && row.$id === rowToDelete && (
                                <DeleteConfirmationDialog
                                    title={`record for date ${row.DATE}`}
                                    confirmDelete={confirmDeletion}
                                    cancelDelete={cancelDeletePhase}
                                />
                            )}
                            {Object.keys(row).map((key, colIndex) =>
                                editingRowId === row.$id ? (
                                    <>
                                        {colIndex > 0 && (
                                            <td
                                                key={`${row.$id}-${colIndex}`}
                                                className="px-1 py-2"
                                            >
                                                <div className="flex items-center text-center justify-center gap-1">
                                                    <input
                                                        type={
                                                            key === "DATE"
                                                                ? "date"
                                                                : "number"
                                                        }
                                                        value={editedData[key]}
                                                        readOnly={key === "BMI" || key === "BF" || key === "MM"}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                key
                                                            )
                                                        }
                                                        // step="0.01" // Allow decimal input
                                                        min={
                                                            key !== "DATE"
                                                                ? 0
                                                                : undefined
                                                        } // Prevent negative numbers for numeric fields
                                                        className="w-full text-center px-0 py-1 border rounded"
                                                    />
                                                </div>
                                            </td>
                                        )}
                                        {colIndex ===
                                            Object.keys(row).length - 1 && (
                                            <td className="sticky right-0 bg-white z-10 px-2 py-2 h-14 flex items-center justify-center border-l-[1px] border-gray-500">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateRow(row.$id)
                                                    }
                                                    disabled={buttonLoading}
                                                    className="text-black hover:text-black mr-2"
                                                >
                                                    {buttonLoading ? (
                                                        <LoadingSpinner className="w-4 h-4" />
                                                    ) : (
                                                        <FaSave />
                                                    )}
                                                </button>
                                            </td>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {colIndex > 0 && (
                                            <td
                                                key={`${row.$id}-${colIndex}`}
                                                className="pl-5 whitespace-nowrap text-sm font-semibold"
                                            >
                                                {row[key]}
                                            </td>
                                        )}
                                        {colIndex ===
                                            Object.keys(row).length - 1 && (
                                            <td className="sticky right-0 bg-white z-10 px-2 py-2 h-14 flex items-center justify-center border-l-[1px] border-gray-500">
                                                <button
                                                    onClick={() =>
                                                        handleEditRow(row.$id)
                                                    }
                                                    className="text-black hover:text-black mr-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeletion(row.$id)
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        )}
                                    </>
                                )
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BMITable;
