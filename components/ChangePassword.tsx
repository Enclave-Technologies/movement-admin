import Link from "next/link";
import React, { Fragment } from "react";
import FormError from "./FormError";
import SecureInput from "./pure-components/SecureInput";
import LoadingSpinner from "./LoadingSpinner";

const ChangePassword = ({
    handlePasswordSubmit,
    passwordForm,
    handlePasswordChange,
    passwordError,
    buttonStatus,
}) => {
    return (
        <div className=" bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4 flex flex-col gap-2">
                    <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Current Password
                    </label>
                    <SecureInput
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="py-2 flex-1"
                        required
                    />
                </div>

                <div className="mb-4 flex flex-col gap-2">
                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        New Password
                    </label>
                    <SecureInput
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="py-2 flex-1"
                        required
                        minLength={8}
                    />
                </div>

                <div className="mb-4 flex flex-col gap-2">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Re-enter New Password
                    </label>
                    <SecureInput
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="py-2 flex-1"
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
                        !passwordForm.confirmPassword ||
                        buttonStatus
                    }
                >
                    {buttonStatus ? (
                        <div className="flex items-center justify-center">
                            <LoadingSpinner className="w-4 h-4 aspect-square mr-2" />
                            <span>Submitting</span>
                        </div>
                    ) : (
                        "Confirm New Password"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
