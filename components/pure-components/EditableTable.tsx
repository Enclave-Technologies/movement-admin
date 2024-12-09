"use client";
import React, { useState } from "react";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import Spinner from "../Spinner";
import LoadingSpinner from "../LoadingSpinner";

const EditableTable = ({
    headerColumns,
    data,
    setData,
    emptyText,
    handleSaveBmc,
}) => {
    const [rowToDelete, setRowToDelete] = useState<string | null>(null); // Store the exercise ID for deletion
    const [saving, setSaving] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const handleEditRow = (rowId) => {
        setEditingRowId(rowId);
        setEditedData(data.find((row) => row.$id === rowId));
    };

    const handleUpdateRow = async (rowId) => {
        // Update the data array with the edited data
        // setSaving(true);
        const updatedData = data.map((row) =>
            row.$id === rowId ? editedData : row
        );
        await handleSaveBmc(editedData);
        setData(updatedData);
        setEditingRowId(null);
        setEditedData({});
        // setSaving(false);
    };

    const handleInputChange = (event, field) => {
        setEditedData({
            ...editedData,
            [field]: event.target.value,
        });
    };

    if (data.length === 0)
        return (
            <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
                <p className="text-gray-500 text-sm font-medium uppercase">
                    {emptyText}
                </p>
                <p className="text-gray-400 text-xs mt-1 uppercase">
                    Click &ldquo;Add&rdquo; to get started
                </p>
            </div>
        );

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left rounded-md overflow-x-auto">
                <thead>
                    <tr className="bg-gray-200 text-black">
                        <th className="sticky left-0 bg-gray-200 text-xs uppercase font-bold pl-5 pr-4 h-8  whitespace-nowrap">
                            Actions
                        </th>
                        {headerColumns.map((column, index) => (
                            <th
                                key={index}
                                className="text-xs uppercase font-bold pl-5 pr-4 h-8  whitespace-nowrap"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="border-t-0 border-white">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`${
                                rowIndex % 2 ? "bg-white" : "bg-gray-100"
                            } h-12 touch-action-none hover:bg-gray-200`}
                        >
                            {Object.keys(row).map((key, colIndex) =>
                                editingRowId === row.$id ? (
                                    <>
                                        {colIndex === 0 && (
                                            <td
                                                className="sticky left-0 bg-white z-10 px-2 py-2 items-center justify-center"
                                                key={colIndex}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleUpdateRow(row.$id)
                                                    }
                                                    className="text-green-500 hover:text-green-700 mr-2"
                                                >
                                                    {setSaving ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        <FaSave />
                                                    )}
                                                </button>
                                            </td>
                                        )}
                                        {colIndex > 0 && (
                                            <td
                                                key={colIndex}
                                                className="px-1 py-2"
                                            >
                                                <div className="flex items-center text-center justify-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={editedData[key]}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                key
                                                            )
                                                        }
                                                        className="w-full text-center px-0 py-1 border rounded"
                                                    />
                                                </div>
                                            </td>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {colIndex === 0 && (
                                            <td className="sticky left-0 bg-white z-10 px-2 py-2 items-center justify-center">
                                                <button
                                                    onClick={() =>
                                                        handleEditRow(row.$id)
                                                    }
                                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    // onClick={
                                                    //     () =>
                                                    //         handleDeleteExercise(
                                                    //             exercise.id
                                                    //         ) // Pass the exercise ID here
                                                    // }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        )}
                                        {colIndex > 0 && (
                                            <td
                                                key={colIndex}
                                                className="pl-5 whitespace-nowrap cursor-pointer text-sm font-semibold"
                                            >
                                                {row[key]}
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

export default EditableTable;
