import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

const WorkoutRecordHeader = ({
    phaseName,
    sessionName,
    startTime,
    handleSave,
    savingState,
}) => {
    const router = useRouter();

    const [time, setTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleClose = async () => {
        // SAVE THE DATA
        const saved = await handleSave();
        console.log(saved);
        router.push("/");
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    };

    return (
        <div className="workout-record-header w-full flex items-center justify-between bg-green-500 px-8 py-4 rounded-lg mb-4">
            <button
                className="close-button text-white py-4 px-4 border rounded-xl bg-red-500/60"
                onClick={handleClose}
                aria-label="Close"
            >
                <ImCross className="text-2xl" />
            </button>
            <ul className="workout-info text-center text-white flex-grow">
                <li className="phase-name font-bold text-lg">{phaseName}</li>
                <li className="session-name">{sessionName}</li>
                <li className="clock">{formatTime(time)}</li>
            </ul>
            <div>
                <button
                    className={`save-button w-32 border items-center justify-center border-solid rounded-xl px-4 py-4 text-white ${
                        savingState
                            ? "bg-gray-500 cursor-wait"
                            : "bg-green-500 hover:bg-green-500"
                    }`}
                    onClick={handleSave}
                    disabled={savingState}
                    aria-label="Save"
                >
                    {savingState ? (
                        <span className="flex">
                            <LoadingSpinner /> Saving...{" "}
                        </span>
                    ) : (
                        "SAVE"
                    )}
                </button>
            </div>
        </div>
    );
};

export default WorkoutRecordHeader;
