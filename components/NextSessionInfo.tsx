import Link from "next/link";
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const NextSessionInfo = ({
    sessionInfo,
    workoutPressed,
    handleStartWorkout,
}) => {
    return (
        <div className="border rounded-lg p-2 mb-5 border-green-500">
            <div className="flex justify-between items-center bg-gray-50 p-2">
                <div className="text-left uppercase flex flex-col">
                    {sessionInfo ? (
                        <>
                            <div>
                                {sessionInfo.phases?.phaseName ||
                                    "No Phase Name"}
                            </div>
                            <div>
                                {sessionInfo.sessionName || "No Session Name"}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-gray-400">
                                No Phase Information
                            </div>
                            <div className="text-gray-400">
                                No Session Information
                            </div>
                            <div className="text-gray-800 text-xs">
                                Please ask your trainer to activate a phase
                            </div>
                        </>
                    )}
                </div>
                <button
                    onClick={sessionInfo ? handleStartWorkout : undefined}
                    className={`px-4 py-2 flex justify-center text-white rounded-lg uppercase w-48 ${
                        sessionInfo && !workoutPressed
                            ? "bg-green-500"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!sessionInfo && workoutPressed}
                >
                    {workoutPressed ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">Starting...</span>
                        </>
                    ) : (
                        "START WORKOUT"
                    )}
                </button>
            </div>
        </div>
    );
};

export default NextSessionInfo;
