import React, { forwardRef } from "react";
import Select, { components, OptionProps } from "react-select";
import SignupButton from "./ResponsiveButton";
import Image from "next/image";
import { defaultProfileURL } from "@/configs/constants";

const Option = (props: OptionProps<any, false>) => {
    const { data } = props;
    return (
        <components.Option {...props}>
            <div className="flex items-center">
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
                        <span className="text-gray-500 text-sm">
                            {data.jobTitle}
                        </span>
                    )}
                </div>
            </div>
        </components.Option>
    );
};

const AddClientForm = forwardRef<HTMLFormElement, AddClientFormProps>(
    ({ action, state, allTrainers }, ref) => {
        return (
            <div>
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
                            htmlFor="trainerId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Select Trainer
                        </label>
                        <Select
                            id="trainerId"
                            name="trainerId"
                            options={allTrainers}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            components={{ Option }}
                            className="mt-1 block w-full"
                            classNamePrefix="react-select"
                        />
                    </div>
                    {/* <pre>{JSON.stringify(allTrainers, null, 2)}</pre> */}

                    <SignupButton label="Submit" />
                </form>
            </div>
        );
    }
);

AddClientForm.displayName = "AddClientForm"; // Set the display name

export default AddClientForm;
