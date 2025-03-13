"use client";
import { API_BASE_URL, defaultProfileURL } from "@/configs/constants";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Select, { components, OptionProps } from "react-select";
import SubmitButton from "../ResponsiveButton";
import { useFormState } from "react-dom";
import { registerClient } from "@/server_functions/auth";
import Toast from "../Toast";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";

const Option = (props: OptionProps<any, false>) => {
    const { data, isSelected, isFocused } = props;
    return (
        <components.Option {...props}>
            <div
                className={`flex items-center px-3 py-2 ${
                    isSelected
                        ? "bg-green-500 text-white"
                        : isFocused
                        ? "bg-gray-100"
                        : "hover:bg-gray-100"
                }`}
            >
                <Image
                    src={data.imageUrl || defaultProfileURL}
                    alt={data.name}
                    width={30}
                    height={30}
                    className="w-8 h-8 rounded-full mr-2"
                />

                <div className="flex flex-col">
                    <span className="font-semibold">{data.name}</span>
                    {data.jobTitle && (
                        <span
                            className={`text-sm ${
                                isSelected ? "text-gray-100" : "text-gray-500"
                            }`}
                        >
                            {data.jobTitle}
                        </span>
                    )}
                </div>
            </div>
        </components.Option>
    );
};

const EditUserForm = ({
    fetchData,
    clientData,
}: {
    fetchData: () => void;
    clientData?: any;
}) => {
    const { trainers } = useGlobalContext();

    const [firstName, setFirstName] = useState(clientData?.firstName || "");
    const [lastName, setLastName] = useState(clientData?.firstName || "");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [trainer, setTrainer] = useState("");
    const [idealWeight, setIdealWeight] = useState("");
    const [dob, setDob] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        if (clientData) {
            const [firstName, lastName] = clientData.name.split(" ");

            setFirstName(firstName);
            setLastName(lastName);
            setPhone(clientData.phone);
            setEmail(clientData.email);
            setGender(clientData.gender);
            setTrainer(
                trainers?.find((trnr) => trnr.uid === clientData.trainer_id) ||
                    null
            );
            setIdealWeight(clientData.idealWeight);
            if (clientData.dob) {
                setDob(clientData.dob.split("T")[0]);
            } else {
                setDob(null);
            }
        }
    }, [clientData]);

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
            typeof data.trainerId !== "string" ||
            data.trainerId.trim() === ""
        ) {
            setToastMessage("Please fill all the fields correctly");
            setToastType("error");
            setShowToast(true);
            return;
        }

        try {
            const response = await axios.put(
                `${API_BASE_URL}/mvmt/v1/trainer/clients`,
                {
                    uid: clientData.uid,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    // email: data.email,
                    phone: data.phone,
                    trainer_id: data.trainerId,
                    trainers: data.trainerId,
                    gender: data.gender,
                    idealWeight: Number(data.idealWeight),
                    dob: data.dateOfBirth,
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

    const handleToastClose = () => {
        setShowToast(false);
    };

    return (
        <div>
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
                        className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
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
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Date of Birth
                    </label>
                    <input
                        type="date" // Changed to 'type="date"' for date input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="trainerId"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Select Trainer
                    </label>

                    <Select
                        id="trainerId"
                        name="trainerId"
                        options={trainers}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.uid}
                        components={{ Option }}
                        className="mt-1 block w-full"
                        classNamePrefix="react-select"
                        value={trainer}
                        onChange={(newTrainer) => setTrainer(newTrainer)}
                        styles={{
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected
                                    ? "#006747" // Selected option background color
                                    : state.isFocused
                                    ? "#f7f7f7" // Hovered option background color
                                    : "white",
                                color: state.isSelected
                                    ? "white" // Selected option text color
                                    : state.isFocused
                                    ? "#006747" // Hovered option text color
                                    : "black",
                            }),
                            menu: (provided) => ({
                                ...provided,
                                borderRadius: "0.5rem", // Change the border radius of the dropdown menu
                                boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Add a box shadow to the dropdown menu
                            }),
                        }}
                    />
                </div>
                <div>
                    <label
                        htmlFor="idealWeight"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Ideal weight
                    </label>
                    <input
                        type="number"
                        id="idealWeight"
                        name="idealWeight"
                        value={idealWeight}
                        onChange={(e) => setIdealWeight(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                        "Submit"
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

export default EditUserForm;
