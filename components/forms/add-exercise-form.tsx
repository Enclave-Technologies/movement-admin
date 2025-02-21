"use client";
import React, { useEffect, useRef, useState } from "react";
import { getDescriptionFromMotion } from "@/configs/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import Select, {
    ActionMeta,
    components,
    OptionProps,
    StylesConfig,
} from "react-select";
import { useFormState } from "react-dom";
import SubmitButton from "../ResponsiveButton";
import Toast from "../Toast";
import { addWorkout } from "@/server_functions/auth";
import Link from "next/link";
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

const AddExerciseForm = ({ fetchData, team, handleCsvFile }) => {
    const { exerciseHierarchy } = useGlobalContext();
    const [selectedMotion, setSelectedMotion] = useState<{
        value: string;
        label: string;
    } | null>(null);
    const [targetAreaOptions, setTargetAreaOptions] = useState<
        { value: string; label: string; description: string }[]
    >([]);
    const [selectedTargetArea, setSelectedTargetArea] = useState<{
        value: string;
        label: string;
        description: string;
    } | null>(null);
    const [formState, formAction] = useFormState(addWorkout, undefined);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [uploadingState, setUploadingState] = useState(false);
    const ref = useRef<HTMLFormElement>(null);

    // const motionOptions = Object.keys(
    //     exerciseHierarchy.reduce((acc, curr) => {
    //         const key = Object.keys(curr)[0];
    //         acc[key] = true;
    //         return acc;
    //     }, {})
    // ).map((option) => ({
    //     value: option,
    //     label: option,
    //     description: getDescriptionFromMotion(option),
    // }));
    // Extract unique exercise names from exerciseHierarchy object
    const motionOptions = Object.entries(
        exerciseHierarchy as ExerciseHierarchy
    ).flatMap(([motion, key]) => ({
        value: motion,
        label: motion,
        description: getDescriptionFromMotion(motion), // Function that gets description based on motion
    }));

    useEffect(() => {
        if (formState?.success) {
            fetchData();
            ref.current?.reset();
            setToastMessage(
                formState.message || "Trainer registered successfully!"
            );
            setToastType("success");
            setShowToast(true);
        } else if (formState?.errors) {
            setToastMessage(Object.values(formState.errors).flat().join(", "));
            setToastType("error");
            setShowToast(true);
        }
    }, [formState]);

    const handleMotionChange = (
        option: { value: string; label: string } | null,
        actionMeta: ActionMeta<{ value: string; label: string }>
    ) => {
        setSelectedMotion(option);

        if (option) {
            // TODO
            // const targetAreaOptions = exerciseHierarchy
            //     .find((item) => Object.keys(item)[0] === option.value)
            //     ?.[option.value].map((area) => ({
            //         value: area,
            //         label: area,
            //         description: area,
            //     }));
            const targetAreaOptions =
                exerciseHierarchy[option.value]?.map((area) => ({
                    value: area,
                    label: area,
                    description: area,
                })) || [];

            setTargetAreaOptions(targetAreaOptions);
            setSelectedTargetArea(targetAreaOptions[0]);
        } else {
            setTargetAreaOptions([]);
        }
    };

    const handleTargetAreaChange = (
        option: { value: string; label: string; description: string } | null,
        actionMeta: ActionMeta<{
            value: string;
            label: string;
            description: string;
        }>
    ) => {
        setSelectedTargetArea(option);
    };

    const handleToastClose = () => {
        setShowToast(false);
    };

    useEffect(() => {
        const csvDropzone = document.getElementById("csv-dropzone");
        let isHandlingDrop = false;

        const handleDragOver = (event) => {
            event.preventDefault();
            csvDropzone.classList.add("dragover");
        };

        const handleDragLeave = (event) => {
            event.preventDefault();
            csvDropzone.classList.remove("dragover");
        };

        const handleDrop = async (event) => {
            event.preventDefault();
            setUploadingState(true);
            if (isHandlingDrop) {
                setToastMessage("Already updating");
                setToastType("error");
                setShowToast(true);
                return;
            }

            isHandlingDrop = true;

            csvDropzone.classList.remove("dragover");
            const files = event.dataTransfer.files;

            if (files.length > 0) {
                const csvFile = files[0];

                if (
                    csvFile.type === "text/csv" ||
                    csvFile.type === "application/vnd.ms-excel"
                ) {
                    const confirmed = confirm(
                        "Do you want to upload this CSV file?"
                    );
                    if (confirmed) {
                        setToastMessage("CSV File received");
                        setToastType("success");
                        setShowToast(true);
                        await handleCsvFile(csvFile);
                        fetchData();
                    } else {
                        setToastMessage("CSV upload canceled.");
                        setToastType("info");
                        setShowToast(true);
                    }
                } else {
                    setToastMessage("Please drop a valid CSV file.");
                    setToastType("error"); // Example of another toast type for error
                    setShowToast(true);
                }
            } else {
                setToastMessage("No files were dropped.");
                setToastType("error");
                setShowToast(true);
            }
            setUploadingState(false);
            setTimeout(() => {
                isHandlingDrop = false;
            }, 1000); // Reset the flag after 1 second
        };

        csvDropzone.addEventListener("dragover", handleDragOver);
        csvDropzone.addEventListener("dragleave", handleDragLeave);
        csvDropzone.addEventListener("drop", handleDrop);

        return () => {
            csvDropzone.removeEventListener("dragover", handleDragOver);
            csvDropzone.removeEventListener("dragleave", handleDragLeave);
            csvDropzone.removeEventListener("drop", handleDrop);
        };
    }, []);

    return (
        <div>
            {uploadingState && (
                <div className="fixed inset-0 bg-black opacity-80 z-30 flex items-center justify-center">
                    <div className="text-white flex flex-col items-center">
                        <LoadingSpinner />
                        <span className="mt-2">
                            Uploading and saving data in the database...
                        </span>
                    </div>
                </div>
            )}
            <form className="space-y-4" action={formAction} ref={ref}>
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
                    {formState?.errors?.Motion && (
                        <p className="text-red-500 text-xs italic">
                            {formState.errors.Motion}
                        </p>
                    )}
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
                        value={selectedTargetArea}
                        onChange={handleTargetAreaChange}
                    />
                    {formState?.errors?.targetArea && (
                        <p className="text-red-500 text-xs italic">
                            {formState.errors.targetArea}
                        </p>
                    )}
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {formState?.errors?.fullName && (
                        <p className="text-red-500 text-xs italic">
                            {formState.errors.fullName}
                        </p>
                    )}
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
                <SubmitButton label="Submit" />
            </form>

            <div className="flex flex-row items-center justify-center space-x-4 py-8">
                <div className="h-[1px] w-full bg-gray-500" />
                <p>OR</p>
                <div className="h-[1px] w-full bg-gray-500" />
            </div>

            <div className="flex flex-col gap-2 items-end">
                <div id="csv-dropzone">Drop CSV file here</div>
                <div className="flex flex-row">
                    <Link
                        className="hover:underline cursor-pointer w-full text-right"
                        href="/files/exercises-sample.csv"
                        download="exercises-sample.csv"
                    >
                        Download Sample CSV
                    </Link>
                </div>
            </div>

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

export default AddExerciseForm;
