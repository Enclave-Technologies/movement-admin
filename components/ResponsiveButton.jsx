import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useFormStatus } from "react-dom";

const SignupButton = ({ label }) => {
    const { pending } = useFormStatus();
    // console.log("Pending state:", pending);

    return (
        <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 
    border-white border-2 rounded-md shadow-sm text-sm font-semibold
    text-white bg-gold-500 hover:bg-green-500 focus:outline-none 
    focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors 
    duration-300 ease-in-out tracking-wider"
            disabled={pending}
        >
            {pending ? (
                <div className="flex items-center justify-center">
                    <LoadingSpinner />{" "}
                    <span className="ml-2">Submitting...</span>
                </div>
            ) : (
                label || ""
            )}
        </button>
    );
};

export default SignupButton;
