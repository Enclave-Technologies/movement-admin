"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    exerciseHierarchy,
    getDescriptionFromMotion,
} from "@/configs/constants";
import Select, {
    ActionMeta,
    components,
    OptionProps,
    StylesConfig,
} from "react-select";
import { useFormState } from "react-dom";
import SignupButton from "../ResponsiveButton";
import Toast from "../Toast";
import { addWorkout } from "@/server_functions/auth";

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

const AddExerciseForm = ({ fetchData, team }) => {
    const [selectedMotion, setSelectedMotion] = useState<{
        value: string;
        label: string;
    } | null>(null);
    const [targetAreaOptions, setTargetAreaOptions] = useState<
        { value: string; label: string; description: string }[]
    >([]);
    const [formState, formAction] = useFormState(addWorkout, undefined);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const ref = useRef<HTMLFormElement>(null);

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
        console.log(formState);
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
            const targetAreaOptions = exerciseHierarchy
                .find((item) => Object.keys(item)[0] === option.value)
                ?.[option.value].map((area) => ({
                    value: area,
                    label: area,
                    description: area,
                }));
            setTargetAreaOptions(targetAreaOptions || []);
        } else {
            setTargetAreaOptions([]);
        }
    };

    const handleToastClose = () => {
        setShowToast(false);
    };

    return (
        <div>
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {formState?.errors?.shortName && (
                        <p className="text-red-500 text-xs italic">
                            {formState.errors.shortName}
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
    );
};

export default AddExerciseForm;
