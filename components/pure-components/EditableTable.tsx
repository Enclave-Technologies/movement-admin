"use client";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const EditableTable = ({ headerColumns, data, emptyText }) => {
    const [rowToDelete, setRowToDelete] = useState<string | null>(null); // Store the exercise ID for deletion
    const [editingRowId, setEditingRoweId] = useState(null);

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
                            {Object.values(row).map((value: any, colIndex) =>
                                editingRowId === value.$id ? (
                                    <></>
                                ) : (
                                    colIndex > 0 && (
                                        <>
                                            <td className="sticky left-0 bg-white z-10 px-2 py-2 items-center justify-center">
                                                <button
                                                    // onClick={() =>
                                                    //     onEditExercise(
                                                    //         exercise.id
                                                    //     )
                                                    // }
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
                                            <td
                                                key={colIndex}
                                                className="pl-5 whitespace-nowrap cursor-pointer text-sm font-semibold"
                                            >
                                                {value}
                                            </td>
                                        </>
                                    )
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
