"use client";

import React, { useEffect, useRef, useState } from "react";
import SignupButton from "@/components/ResponsiveButton";
import { fetchUserDetails, register } from "@/server_functions/auth";
import { useFormState } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import Toast from "@/components/Toast";
import Spinner from "@/components/Spinner";
const AdminPanel = () => {
    const [state, action] = useFormState(register, undefined);
    const [pageLoading, setPageLoading] = useState(true);
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const ref = useRef<HTMLFormElement>(null);
    console.log(state);

    useEffect(() => {
        async function loadData() {
            try {
                setPageLoading(true);
                const details = await fetchUserDetails();
                setTrainerDetails(details);
            } catch (error) {
                console.log(error);
            } finally {
                setPageLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        if (state?.success) {
            ref.current?.reset();
            setToastMessage(state.message || "User registered successfully!");
            setToastType("success");
            setShowToast(true);
        } else if (state?.errors) {
            setToastMessage(Object.values(state.errors).flat().join(", "));
            setToastType("error");
            setShowToast(true);
        }
    }, [state]);

    const handleToastClose = () => {
        setShowToast(false);
    };

    if (pageLoading) {
        return <Spinner />;
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            {trainerDetails?.team.name === "Admins" && (
                <div className="w-full max-w-md p-6 bg-gray-50 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Register a Trainer / Admin
                    </h2>
                    <form className="space-y-4" action={action} ref={ref}>
                        <div>
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {state?.errors?.firstName && (
                                <p className="text-red-500 text-xs italic">
                                    {state.errors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {state?.errors?.lastName && (
                                <p className="text-red-500 text-xs italic">
                                    {state.errors.lastName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {state?.errors?.phone && (
                                <p className="text-red-500 text-xs italic">
                                    {state.errors.phone}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {state?.errors?.email && (
                                <p className="text-red-500 text-xs italic">
                                    {state.errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="jobTitle"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Job Title
                            </label>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {state?.errors?.jobTitle && (
                                <p className="text-red-500 text-xs italic">
                                    {state.errors.jobTitle}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="admin">Admin</option>
                                <option value="trainer">Trainer</option>
                            </select>
                            {state?.errors?.role && (
                                <p className="text-red-500 text-xs italic">
                                    {state.errors.role}
                                </p>
                            )}
                        </div>
                        <SignupButton label="Submit" />
                    </form>
                    {showToast && (
                        <Toast
                            message={toastMessage}
                            onClose={handleToastClose}
                            type={toastType}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
