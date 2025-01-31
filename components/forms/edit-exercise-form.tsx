"use client";
import React, { useEffect, useState } from "react";
import {
    API_BASE_URL,
    exerciseHierarchy,
    getDescriptionFromMotion,
} from "@/configs/constants";
import Select, {
    ActionMeta,
    components,
    OptionProps,
    StylesConfig,
} from "react-select";
import SubmitButton from "../ResponsiveButton";
import Toast from "../Toast";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";

const Option = (props: OptionProps<any, false>) => {
    const { data } = props;

    return (
        <components.Option {...props}>
            <div className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                <div className="flex flex-col">
                    <span className="text-gray-800 font-medium capitalize">
                        {data.label}
                    </span>
                    <span className="text-gray-500 text-sm">
                        {data.description}
                    </span>
                </div>
            </div>
        </components.Option>
    );
};

const customStyles: StylesConfig<any, false> = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        boxShadow: "none",
        "&:hover": {
            border: "1px solid #d1d5db",
        },
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#e5e7eb" : "white",
        color: state.isSelected ? "#1f2937" : "#374151",
        padding: "0.5rem 1rem",
        "&:hover": {
            backgroundColor: "#f3f4f6",
        },
    }),
};

const EditExerciseForm = ({ refreshTable, team, rowData }) => {
    const [selectedMotion, setSelectedMotion] = useState<{
        value: string;
        label: string;
    } | null>(null);
    const [targetAreaOptions, setTargetAreaOptions] = useState<
        { value: string; label: string; description: string }[]
    >([]);
    const [targetArea, setTargetArea] = useState<{
        value: string;
        label: string;
        description: string;
    } | null>(null);
    const [fullName, setFullName] = useState(rowData?.fullName);
    const [shortName, setShortName] = useState(rowData?.shortName);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (rowData) {
            setSelectedMotion({ value: rowData.motion, label: rowData.motion });
            setTargetArea({
                value: rowData.targetArea,
                label: rowData.targetArea,
                description: rowData.targetArea,
            });
            setFullName(rowData.fullName);
            setShortName(rowData.shortName);
        }
    }, [rowData]);

    const motionOptions = Object.keys(
        exerciseHierarchy.reduce((acc, curr) => {
            const key = Object.keys(curr)[0];
            acc[key] = true;
            return acc;
        }, {})
    ).map((option) => ({
        value: option,
        label: option,
        description: getDescriptionFromMotion(option),
    }));

    useEffect(() => {
        if (selectedMotion) {
            const targetAreaOptions = exerciseHierarchy
                .find((item) => Object.keys(item)[0] === selectedMotion.value)
                ?.[selectedMotion.value].map((area) => ({
                    value: area,
                    label: area,
                    description: area,
                }));
            setTargetAreaOptions(targetAreaOptions || []);
            setTargetArea(targetAreaOptions[0] || null);
        }
    }, [selectedMotion]);

    const handleToastClose = () => {
        setShowToast(false);
    };

    const handleMotionChange = (
        option: { value: string; label: string } | null,
        actionMeta: ActionMeta<{ value: string; label: string }>
    ) => {
        setSelectedMotion(option);

        if (option) {
            const targetAreaOptions = exerciseHierarchy
                .find((item) => Object.keys(item)[0] === option.value)
                ?.[option.value].map((area) => ({
                    value: area,
                    label: area,
                    description: area,
                }));
            setTargetAreaOptions(targetAreaOptions || []);
            setTargetArea(targetAreaOptions[0] || null);
        } else {
            setTargetAreaOptions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        // Verify the form data
        if (
            typeof data.Motion !== "string" ||
            typeof data.targetArea !== "string" ||
            typeof data.fullName !== "string" ||
            typeof data.shortName !== "string"
        ) {
            setToastMessage("Invalid form data");
            setToastType("error");
            setShowToast(true);
            return;
        }
        try {
            const response = await axios.put(
                `${API_BASE_URL}/mvmt/v1/admin/exercises`,
                {
                    updates: [
                        {
                            id: rowData.id,
                            motion: data.Motion,
                            targetArea: data.targetArea,
                            fullName: data.fullName,
                            shortName: data.shortName,
                            approved: "Admins" === data.authorization,
                        },
                    ],
                },
                {
                    withCredentials: true,
                }
            );

            setToastMessage(`Exercise ${data.fullName} updated successfully`);
            setToastType("success");
            setShowToast(true);
            refreshTable();
        } catch (error) {
            console.error("Error updating exercise:", error);
            setToastMessage("Error updating exercise");
            setToastType("error");
            setShowToast(true);
        }
        setSubmitted(false);
    };

    return (
        <div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor="Motion"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Motion
                    </label>
                    <Select
                        id="Motion"
                        name="Motion"
                        options={motionOptions}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        components={{ Option }}
                        className="mt-1 block w-full"
                        classNamePrefix="react-select"
                        onChange={handleMotionChange}
                        value={selectedMotion}
                        styles={customStyles}
                    />
                </div>

                <div>
                    <label
                        htmlFor="targetArea"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Target Area
                    </label>
                    <Select
                        id="targetArea"
                        name="targetArea"
                        options={targetAreaOptions}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        components={{ Option }}
                        className="mt-1 block w-full"
                        classNamePrefix="react-select"
                        styles={customStyles}
                        value={targetArea}
                    />
                </div>

                <div>
                    <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Full Exercise Title
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFullName(e.target.value);
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="shortName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Shortend Name
                    </label>
                    <input
                        type="text"
                        id="shortName"
                        name="shortName"
                        value={shortName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setShortName(e.target.value);
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        id="authorization"
                        name="authorization"
                        defaultValue={team}
                        className="hidden read-only"
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

export default EditExerciseForm;
