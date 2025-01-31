"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { defaultProfileURL } from "@/configs/constants";
import axios from "axios";
import ImageUploadModal from "@/components/ImageUploadModal";
import Spinner from "@/components/Spinner";
import PageLoading from "@/components/PageLoading";
import ProfileImage from "@/components/ProfileImage";
import AccountSettings from "@/components/AccountSettings";
import ChangePassword from "@/components/ChangePassword";
import Toast from "@/components/Toast";
import { API_BASE_URL } from "@/configs/constants";
const SettingsPage = () => {
    const [pageLoading, setPageLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<TrainerSettings>({
        $id: "",
        auth_id: "",
        firstName: "",
        lastName: "",
        imageURL: null,
        jobTitle: "",
        email: "",
        phone: "",
        emailVerification: false,
        phoneVerification: false,
        $createdAt: "",
        $updatedAt: "",
        accessedAt: "",
    });
    const [showImageUploadModal, setShowImageUploadModal] = useState(false);
    const [imageUploadError, setImageUploadError] = useState("");

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [dataModified, setDataModified] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        async function loadData() {
            setPageLoading(true);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/settings`,
                    { withCredentials: true }
                );

                setFormData(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setPageLoading(false);
            }
        }
        loadData();
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError(
                "New password must be at least 8 characters long."
            );
            return;
        }

        if (passwordForm.currentPassword === passwordForm.confirmPassword) {
            setPasswordError(
                "New password cannot be the same as old password."
            );
            return;
        }

        // DONE: Implement API call to change password
        // console.log("Password form submitted:", passwordForm);
        try {
            setUploading(true);
            await axios.patch(
                `${API_BASE_URL}/mvmt/v1/trainer/update-password`,
                passwordForm,
                {
                    withCredentials: true,
                }
            );
            // Handle success case
            setToastMessage("Password changed successfully");
            setToastType("success");
            setShowToast(true);
            // Reload the page on successful submission
            // window.location.reload(); // This will refresh the page
        } catch (error) {
            console.error("Error saving settings:", error);
            // Handle success case
            setToastMessage(error.message);
            setToastType("error");
            setShowToast(true);
        } finally {
            setUploading(false);
        }
        // Reset form after successful submission
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setDataModified(true);
        console.log(`${name} : ${value}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // DONE: Implement API call to save account settings
        try {
            await axios.patch(
                `${API_BASE_URL}/mvmt/v1/trainer/settings`,
                formData,
                {
                    withCredentials: true,
                }
            );
            setDataModified(false);
            // Handle success case
            console.log("Settings saved successfully");
            // Reload the page on successful submission
            window.location.reload(); // This will refresh the page
            setToastMessage("Settings saved successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error("Error saving settings:", error);
            setToastMessage(error.message);
            setToastType("error");
            setShowToast(true);
        }
    };

    const handleImageChange = async (e, isCapture) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            setShowImageUploadModal(false);
            setImageUploadError("");
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/mvmt/v1/file/image-upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                );
                const imageUrl = response.data.url; // Assuming your backend returns the URL
                setFormData((prevData) => ({
                    ...prevData,
                    imageURL: imageUrl,
                }));
                setDataModified(true);
            } catch (error) {
                console.error("Image upload failed:", error);
                setImageUploadError(
                    "Image upload failed. Please ensure your image is a valid JPG or PNG file, and that it does not exceed the maximum file size limit of 5MB."
                );
            } finally {
                setUploading(false);
            }
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (dataModified) {
                e.preventDefault();
                // e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [dataModified]);

    return pageLoading ? (
        <PageLoading />
    ) : (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Settings</h1>
                {/* <div>
                    <button className="px-4 py-2 bg-gray-200 rounded-md mr-2">
                        Reset
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-md">
                        Save
                    </button>
                </div> */}
            </div>

            <p className="text-gray-600 mb-6">
                Update your photo and personal details here
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">
                        Account Settings
                    </h2>
                    {/* ProfileImage component */}
                    <ProfileImage
                        imageUrl={formData.imageURL || defaultProfileURL}
                        handleImageChange={handleImageChange}
                        imageUploadError={imageUploadError}
                        setShowImageUploadModal={setShowImageUploadModal}
                        showImageUploadModal={showImageUploadModal}
                        uploading={uploading}
                    />
                    {/* AccountSettings component */}
                    <AccountSettings
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                    />
                </div>
                {/* ChangePassword component */}
                <ChangePassword
                    handlePasswordChange={handlePasswordChange}
                    handlePasswordSubmit={handlePasswordSubmit}
                    passwordError={passwordError}
                    passwordForm={passwordForm}
                />
            </div>
            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                    type={toastType}
                />
            )}
        </div>
    );
};

export default SettingsPage;
