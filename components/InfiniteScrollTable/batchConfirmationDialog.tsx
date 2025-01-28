import React from "react";
import LoadingSpinner from "../LoadingSpinner";

const BatchConfirmationDialog = ({
    title,
    confirmOp,
    cancelOp,
    loadingState = false,
}: BatchConfirmationDialogProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p>{title}</p>
                <div className="mt-4 flex justify-end">
                    <button
                        className="mr-2 bg-primary text-white px-4 py-2 rounded-lg transition-transform active:scale-95"
                        onClick={confirmOp}
                        disabled={loadingState}
                    >
                        <div className="flex items-center justify-center">
                            {loadingState ? (
                                <LoadingSpinner className="h-4 w-4" />
                            ) : (
                                "Yes"
                            )}
                        </div>
                    </button>
                    <button
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg transition-transform active:scale-95"
                        onClick={cancelOp}
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

export default BatchConfirmationDialog;
