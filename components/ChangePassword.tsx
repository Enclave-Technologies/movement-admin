import Link from "next/link";
import React from "react";
import FormError from "./FormError";

const ChangePassword = ({
    handlePasswordSubmit,
    passwordForm,
    handlePasswordChange,
    passwordError,
}) => {
    return (
        <div className=" bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                        required
                    />
                    <div className="mt-1 text-right">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-green-500 hover:text-green-900"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                        required
                        minLength={8}
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Re-enter New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border-black border py-2 px-3 shadow-sm focus:outline-none"
                        required
                    />
                </div>

                {passwordError && <FormError message={passwordError} />}

                <button
                    type="submit"
                    className={`px-4 py-2 w-full text-white rounded-md ${
                        passwordForm.currentPassword &&
                        passwordForm.newPassword &&
                        passwordForm.confirmPassword
                            ? "bg-green-500 hover:bg-green-900"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={
                        !passwordForm.currentPassword ||
                        !passwordForm.newPassword ||
                        !passwordForm.confirmPassword
                    }
                >
                    Confirm New Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
