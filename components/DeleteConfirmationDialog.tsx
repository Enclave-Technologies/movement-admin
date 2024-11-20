import React from "react";

const DeleteConfirmationDialog = ({ title, confirmDelete, cancelDelete }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p>Are you sure you want to delete this {title}?</p>
                <div className="mt-4">
                    <button
                        className="mr-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={confirmDelete}
                    >
                        Yes, Delete
                    </button>
                    <button
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                        onClick={cancelDelete}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationDialog;
