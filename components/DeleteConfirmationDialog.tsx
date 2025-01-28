import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const DeleteConfirmationDialog = ({
    title,
    confirmDelete,
    cancelDelete,
    isLoading = false,
}: DeleteConfirmationDialogProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p>Are you sure you want to delete this {title}?</p>
                <div className="mt-4 flex justify-end">
                    <button
                        className=" bg-red-500 mr-2 text-white px-4 py-2 rounded-lg transition-transform active:scale-95"
                        onClick={confirmDelete}
                        disabled={isLoading}
                    >
                        <div className="flex items-center justify-center">
                            {isLoading ? (
                                <LoadingSpinner className="h-4 w-4" />
                            ) : (
                                "Yes, Delete"
                            )}
                        </div>
                    </button>
                    <button
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg transition-transform active:scale-95"
                        onClick={cancelDelete}
                    >
                        <div className="flex items-center justify-center">
                            Cancel
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationDialog;
