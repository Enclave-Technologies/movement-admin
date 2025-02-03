"use client";

import React from "react";
import SubmitButton from "@/components/ResponsiveButton";
import { resetPassword } from "@/server_functions/auth"; // Assuming you have this function
import { useFormState } from "react-dom"; // Assuming similar state management as login
import Image from "next/image";
import Link from "next/link";

const ForgotPasswordPage = () => {
    const [state, action] = useFormState(resetPassword, undefined);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-500">
            <div className="w-full max-w-md p-6 bg-gray-50 shadow-lg rounded-lg">
                <div className="flex justify-center items-center w-full">
                    <Image
                        src="/images/Logo-movement.svg"
                        alt="Forgot Password"
                        width={48}
                        height={16}
                        className="w-52"
                    />
                </div>
                <h2 className="mt-4 text-center text-lg font-medium text-gray-700">
                    Reset Password
                </h2>
                <form className="space-y-4" action={action}>
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
                    <SubmitButton label="Send Reset Link" />
                </form>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex-1 text-sm text-gray-600">
                        Remembered your password?{" "}
                        <Link
                            href="/login"
                            className="text-gold-500 hover:underline cursor-pointer"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
