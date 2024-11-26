import React, { forwardRef } from "react";
import SignupButton from "./ResponsiveButton";

const RegisterForm = forwardRef<HTMLFormElement, AddFormProps>(
    ({ action, state }, ref) => {
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
                            <option value="trainer">Trainer</option>
                            <option value="admin">Admin</option>
                        </select>
                        {state?.errors?.role && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.role}
                            </p>
                        )}
                    </div>
                    <SignupButton label="Submit" />
                </form>
            </div>
        );
    }
);

RegisterForm.displayName = "RegisterForm"; // Set the display name

export default RegisterForm;
