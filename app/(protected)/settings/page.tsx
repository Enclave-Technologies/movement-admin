"use client";
import React, { useState } from "react";
import Image from "next/image";
import { defaultProfileURL } from "@/configs/constants";

const SettingsPage = () => {
    const [formData, setFormData] = useState<TrainerDetails>({
        auth_id: "66f67909000ad1f8c7cf",
        firstName: "Avishek",
        lastName: "Majumder",
        imageURL: null,
        jobTitle: "Personal Trainer | Body Transformation",
        $id: "66f67909000ad1f8c7cf",
        $createdAt: "2024-09-27T09:21:19.722+00:00",
        $updatedAt: "2024-10-24T06:54:52.135+00:00",
        $permissions: [],
        $databaseId: "movement-hk-dev",
        $collectionId: "66e420ee00296a1fd679",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");

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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API call to save account settings
        console.log("Form submitted:", formData);
    };

    return (
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
                                objectFit="cover"
                                className="rounded-full"
                            />
                        </div>
                        <button className="mt-2 px-4 py-2 w-1/2 bg-green-500 text-white rounded-md">
                            Edit Photo
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
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
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email ID
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.auth_id}
                                readOnly
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
