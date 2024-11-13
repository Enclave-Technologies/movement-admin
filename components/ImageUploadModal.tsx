// components/ImageUploadModal.tsx
import React from "react";

const ImageUploadModal = ({ handleImageChange, setShowModal }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4 text-center">
                    Choose an Option
                </h2>

                <div className="flex flex-col space-y-4">
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                        onClick={() =>
                            document.getElementById("cameraInput").click()
                        }
                    >
                        Take Photo
                        <input
                            id="cameraInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, true)}
                            capture
                            className="hidden"
                        />
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                        onClick={() =>
                            document.getElementById("uploadInput").click()
                        }
                    >
                        Upload Photo
                        <input
                            id="uploadInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, false)}
                            className="hidden"
                        />
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
