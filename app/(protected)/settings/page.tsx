"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { defaultProfileURL } from "@/configs/constants";
import axios from "axios";
import ImageUploadModal from "@/components/ImageUploadModal";
import Spinner from "@/components/Spinner";
import PageLoading from "@/components/PageLoading";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

    const handlePasswordSubmit = (e: React.FormEvent) => {
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

        // TODO: Implement API call to change password
        console.log("Password form submitted:", passwordForm);
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

        console.log(`${name} : ${value}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API call to save account settings
        try {
            await axios.put(
                `${API_BASE_URL}/mvmt/v1/trainer/settings`,
                formData,
                {
                    withCredentials: true,
                }
            );
            // Handle success case
            console.log("Settings saved successfully");
            // Reload the page on successful submission
            window.location.reload(); // This will refresh the page
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    // const handleUploadChange = async (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setUploading(true); // Start loading
    //         // Create FormData to send the file to the backend
    //         const formData = new FormData();
    //         formData.append("file", file);

    //         try {
    //             const response = await axios.post(
    //                 `${API_BASE_URL}/mvmt/v1/file/image-upload`,
    //                 formData,
    //                 {
    //                     headers: {
    //                         "Content-Type": "multipart/form-data",
    //                     },
    //                     withCredentials: true,
    //                 }
    //             );
    //             const imageUrl = response.data.url; // Assuming your backend returns the URL
    //             // Update the existing formData with the new imageURL
    //             setFormData((prevData) => ({
    //                 ...prevData,
    //                 imageURL: imageUrl,
    //             }));
    //         } catch (error) {
    //             console.error("Image upload failed:", error);
    //             setImageUploadError("Image upload failed. Please try again.");
    //         } finally {
    //             setUploading(false); // Start loading
    //         }
    //     }
    //     setShowImageUploadModal(false);
    // };

    // const handleCaptureChange = async (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setUploading(true); // Start loading
    //         // Create FormData to send the file to the backend
    //         const formData = new FormData();
    //         formData.append("file", file);

    //         try {
    //             const response = await axios.post(
    //                 `${API_BASE_URL}/mvmt/v1/file/image-upload`,
    //                 formData,
    //                 {
    //                     headers: {
    //                         "Content-Type": "multipart/form-data",
    //                     },
    //                     withCredentials: true,
    //                 }
    //             );
    //             const imageUrl = response.data.url; // Assuming your backend returns the URL
    //             // Update the existing formData with the new imageURL
    //             setFormData((prevData) => ({
    //                 ...prevData,
    //                 imageURL: imageUrl,
    //             }));
    //         } catch (error) {
    //             console.error("Image upload failed:", error);
    //             setImageUploadError("Image upload failed. Please try again.");
    //         } finally {
    //             setUploading(false); // Start loading
    //         }
    //     }
    //     setShowImageUploadModal(false);
    // };

    const handleImageChange = async (e, isCapture) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            setShowImageUploadModal(false);
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
            } catch (error) {
                console.error("Image upload failed:", error);
                setImageUploadError("Image upload failed. Please try again.");
            } finally {
                setUploading(false);
            }
        }
    };

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

                    <div className="flex flex-col items-center mb-4">
                        <div className="relative w-24 h-24 mb-2">
                            <Image
                                src={formData.imageURL || defaultProfileURL}
                                alt="Profile Picture"
                                // width={100}
                                // height={100}
                                layout="fill"
                                className="rounded-full object-cover"
                            />
                        </div>
                        <button
                            onClick={() => setShowImageUploadModal(true)}
                            className="mt-2 px-4 py-2 w-1/2 bg-green-500 text-white rounded-md"
                        >
                            Edit Photo
                        </button>
                        {imageUploadError && (
                            <div className="mt-2 text-red-500 text-sm text-center">
                                {imageUploadError}
                            </div>
                        )}
                        {uploading && <Spinner />}
                        {showImageUploadModal && (
                            <ImageUploadModal
                                handleImageChange={handleImageChange}
                                setShowModal={setShowImageUploadModal}
                            />
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email ID
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm cursor-not-allowed bg-gray-200 focus:outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="jobTitle"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Role
                            </label>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone ?? ""} // Using nullish coalescing operator
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <div className=" bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">
                        Change Password
                    </h2>
                    <form>
                        <div className="mb-4">
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                                required
                            />
                            <div className="mt-1 text-right">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-green-500 hover:text-green-900"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Re-enter New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                                required
                            />
                        </div>

                        {passwordError && (
                            <div className="mb-4 text-red-500 text-sm">
                                {passwordError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 w-full text-white rounded-md"
                        >
                            Confirm New Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
