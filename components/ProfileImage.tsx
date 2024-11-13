import Image from "next/image";
import React from "react";
import Spinner from "./Spinner";
import ImageUploadModal from "./ImageUploadModal";
import FormError from "./FormError";

const ProfileImage = ({
    imageUrl,
    setShowImageUploadModal,
    uploading,
    imageUploadError,
    showImageUploadModal,
    handleImageChange,
}) => {
    return (
        <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-2">
                <Image
                    src={imageUrl}
                    alt="Profile Picture"
                    // width={100}
                    // height={100}
                    layout="fill"
                    className="rounded-full object-cover"
                />
            </div>
            <button
                onClick={() => setShowImageUploadModal(true)}
                className="mt-2 px-4 py-2 w-1/2 bg-green-500 hover:bg-green-900 text-white rounded-md"
            >
                Edit Photo
            </button>
            {imageUploadError && (
                <FormError message={imageUploadError} className="text-center" />
            )}
            {uploading && <Spinner />}
            {showImageUploadModal && (
                <ImageUploadModal
                    handleImageChange={handleImageChange}
                    setShowModal={setShowImageUploadModal}
                />
            )}
        </div>
    );
};

export default ProfileImage;
