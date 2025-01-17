import React from "react";
import SubmitButton from "./ResponsiveButton";

const AccountSettings = ({ formData, handleSubmit, handleInputChange }) => {
    return (
        <form onSubmit={handleSubmit}>
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
                    value={formData.email}
                    readOnly
                    className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm cursor-not-allowed bg-gray-200 focus:outline-none"
                />
            </div>

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
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                >
                    Phone Number
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone ?? ""} // Using nullish coalescing operator
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                />
            </div>

            {/* <div className="flex justify-end"> */}
            {/* <button
                    type="submit"
                    className="px-4 py-2 bg-green-500  hover:bg-green-900 text-white rounded-md"
                >
                    Save Changes
                </button> */}
            <SubmitButton label="Submit" />
            {/* </div> */}
        </form>
    );
};

export default AccountSettings;
