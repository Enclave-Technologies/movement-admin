"use client";

import React from "react";
import SignupButton from "@/components/ResponsiveButton";
import { login } from "@/server_functions/auth";
import { useFormState } from "react-dom";
import Link from "next/link";

const Page = () => {
    const loading = false;

    const [state, action] = useFormState(login, undefined);
    console.log(state);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Sign In
                </h1>
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
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.password && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.password}
                            </p>
                        )}
                    </div>
                    <SignupButton label="Login" />
                </form>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex-1 text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <span className="text-blue-500 hover:underline cursor-pointer">
                            Register through Admin
                        </span>
                    </div>
                    <div className="flex-1 text-right">
                        {/* <a
                            href="/forgot-password"
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot Password?
                        </a> */}
                        <Link
                            href="/forgot-password"
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
