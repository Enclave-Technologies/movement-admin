"use client";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import SubmitButton from "../ResponsiveButton";
import { useFormState } from "react-dom";
import { registerCoach } from "@/server_functions/auth";
import Toast from "../Toast";

const RegisterTrainerForm = ({ fetchData }) => {
    const [state, action] = useFormState(registerCoach, undefined);
    const ref = useRef<HTMLFormElement>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        if (state?.success) {
            fetchData();
            ref.current?.reset();
            setToastMessage(
                state.message || "Trainer registered successfully!"
            );
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

    return (
        <div className="w-full">
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
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="m">M</option>
                        <option value="f">F</option>
                    </select>
                    {state?.errors?.gender && (
                        <p className="text-red-500 text-xs italic">
                            {state.errors.gender}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Date of Birth
                    </label>
                    <input
                        type="date" // Changed to 'type="date"' for date input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {state?.errors?.dateOfBirth && ( // Updated error handling for dateOfBirth
                        <p className="text-red-500 text-xs italic">
                            {state.errors.dateOfBirth}
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
                        <option value="trainers">Trainer</option>
                        <option value="admins">Admin</option>
                    </select>
                    {state?.errors?.role && (
                        <p className="text-red-500 text-xs italic">
                            {state.errors.role}
                        </p>
                    )}
                </div>
                <SubmitButton label="Submit" />
            </form>
            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={handleToastClose}
                    type={toastType}
                />
            )}
        </div>
    );
};

export default RegisterTrainerForm;
