import Image from "next/image";
import React from "react";
import Spinner from "./Spinner";
import ImageUploadModal from "./ImageUploadModal";
import FormError from "./FormError";
import { TbEdit } from "react-icons/tb";

const ProfileImage = ({
    imageUrl,
    setShowImageUploadModal,
    uploading,
    imageUploadError,
    showImageUploadModal,
    handleImageChange,
}) => {
    return (
        <div className="flex flex-col items-start mb-4 justify-start">
            <div className="relative w-24 h-24 mb-2 group">
                <Image
                    src={imageUrl}
                    alt="Profile Picture"
                    // width={100}
                    // height={100}
                    layout="fill"
                    className="rounded-full object-cover group-hover:opacity-70"
                />
                <button
                    onClick={() => setShowImageUploadModal(true)}
                    // className="mt-2 px-4 py-2 w-1/2 bg-green-500 hover:bg-green-900 text-white rounded-md"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    px-10 py-10 bg-gray-700/50 hover:bg-black/50 text-gray-300 
                    rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <TbEdit />
                </button>
            </div>
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
