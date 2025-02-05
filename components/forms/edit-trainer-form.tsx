"use client";
import React, { useEffect, useState } from "react";
import Toast from "../Toast";
import axios from "axios";
import { API_BASE_URL } from "@/configs/constants";
import LoadingSpinner from "../LoadingSpinner";

const EditTrainerForm = ({ fetchData, clientData }) => {
    const [firstName, setFirstName] = useState(clientData?.firstName || "");
    const [lastName, setLastName] = useState(clientData?.firstName || "");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [role, setRole] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        if (clientData) {
            // const [firstName, lastName] = clientData.name.split(" ");

            setFirstName(clientData.firstName);
            setLastName(clientData.lastName);
            setPhone(clientData.phone);
            setEmail(clientData.email);
            setGender(clientData.gender);
            setJobTitle(clientData.jobTitle);
            setRole(clientData.role);
        }
    }, [clientData]);

    const handleToastClose = () => {
        setShowToast(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Verify the form data
        if (
            typeof data.firstName !== "string" ||
            data.firstName.trim() === "" ||
            typeof data.lastName !== "string" ||
            data.lastName.trim() === "" ||
            typeof data.phone !== "string" ||
            typeof data.email !== "string" ||
            typeof data.gender !== "string" ||
            data.gender.trim() === "" ||
            typeof data.jobTitle !== "string" ||
            typeof data.role !== "string" ||
            data.role.trim() === ""
        ) {
            setToastMessage("Please fill all the fields correctly");
            setToastType("error");
            setShowToast(true);
        }

        try {
            const response = await axios.put(
                `${API_BASE_URL}/mvmt/v1/admin/trainers`,
                {
                    uid: clientData.auth_id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    gender: data.gender,
                    jobTitle: data.jobTitle,
                    role: data.role,
                },
                {
                    withCredentials: true,
                }
            );

            setToastMessage(
                `${data.firstName} ${data.lastName} updated successfully`
            );
            setToastType("success");
            setShowToast(true);
            fetchData();
        } catch (error) {
            console.error("Error updating exercise:", error);
            setToastMessage("Error updating exercise");
            setToastType("error");
            setShowToast(true);
        }
        setSubmitted(false);
    };

    return (
        <div className="w-full">
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
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
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
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
                        value={email}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
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
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="m">M</option>
                        <option value="f">F</option>
                    </select>
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
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Role
                    </label>
                    {/* <select
                        id="role"
                        name="role"
                        value={role}
                        readOnly
                        // onChange={(e) => setRole(e.target.value)}
                        className="readonly mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="Trainers">Trainer</option>
                        <option value="Admins">Admin</option>
                    </select> */}
                    <input
                        type="role"
                        id="role"
                        name="role"
                        value={role === "Admins" ? "Admin" : "Trainer"}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 
    border-white border-2 rounded-md shadow-sm text-sm font-semibold
    text-white bg-green-500 hover:bg-green-900 focus:outline-none 
    focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors 
    duration-300 ease-in-out tracking-wider"
                    disabled={submitted}
                >
                    {submitted ? (
                        <div className="flex items-center justify-center">
                            <LoadingSpinner className="w-4 h-4 aspect-square" />{" "}
                            <span className="ml-2">Submitting...</span>
                        </div>
                    ) : (
                        `Submit`
                    )}
                </button>
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

export default EditTrainerForm;
