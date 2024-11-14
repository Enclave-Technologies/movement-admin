"use client";

import React from "react";
import SignupButton from "@/components/ResponsiveButton";
import { updatePassword } from "@/server_functions/auth"; // Assuming you have this function to update the password
import { useFormState } from "react-dom"; // Assuming similar state management as login
import Image from "next/image";
import Link from "next/link";

const ConfirmPasswordPage = () => {
    const [state, action] = useFormState(updatePassword, undefined);
    console.log(state);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-500">
            <div className="w-full max-w-md p-6 bg-gray-50 shadow-lg rounded-lg">
                <div className="flex justify-center items-center w-full">
                    <Image
                        src="/Logo-movement.svg"
                        alt="Confirm Password"
                        width={48}
                        height={16}
                        className="w-52"
                    />
                </div>
                <h2 className="mt-4 text-center text-lg font-medium text-gray-700">
                    Set New Password
                </h2>
                <form className="space-y-4" action={action}>
                    <div>
                        <label
                            htmlFor="new-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            name="new-password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.newPassword && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.newPassword}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.confirmPassword && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.confirmPassword}
                            </p>
                        )}
                    </div>
                    <SignupButton label="Update Password" />
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    <Link
                        href="/login"
                        className="text-gold-500 hover:underline cursor-pointer"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPasswordPage;
