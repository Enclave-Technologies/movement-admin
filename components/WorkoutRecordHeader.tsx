import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { BiExit } from "react-icons/bi";
import { GiExitDoor } from "react-icons/gi";
import { IoMdExit, IoMdSave } from "react-icons/io";

const WorkoutRecordHeader = ({
    setShowDeleteDialog,
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
        <div className="workout-record-header w-full flex items-center justify-center bg-green-500 px-8 py-4 rounded-lg mb-4">
            <div className="max-w-[920px] w-full flex items-center justify-between bg-green-500 rounded-lg">
                <button
                    className="close-button w-32 text-white py-4 px-4 border rounded-xl bg-red-500 hover:bg-red-600 flex flex-row items-center justify-center gap-2"
                    onClick={() => {
                        setShowDeleteDialog(true);
                    }}
                    aria-label="Close"
                >
                    <IoMdExit size={20} className="scale-x-[-1]" />
                    <p>Quit</p>
                </button>
                <ul className="workout-info text-center text-white flex-grow">
                    <li className="phase-name font-bold text-lg">
                        {phaseName}
                    </li>
                    <li className="session-name">{sessionName}</li>
                    <li className="clock">{formatTime(time)}</li>
                </ul>
                <div>
                    <button
                        className={`save-button w-32 border items-center justify-center border-solid rounded-xl px-4 py-4 text-white hover:bg-green-950 hover:text-white ${
                            savingState
                                ? "bg-gray-500 cursor-wait"
                                : "bg-green-500 hover:bg-green-500"
                        }`}
                        onClick={handleSave}
                        disabled={savingState}
                        aria-label="Save"
                    >
                        {savingState ? (
                            <span className="flex flex-row items-center justify-center gap-2">
                                <LoadingSpinner /> Saving...{" "}
                            </span>
                        ) : (
                            <div className="flex flex-row items-center justify-center gap-2">
                                <IoMdSave size={20} />
                                <p>Save</p>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutRecordHeader;
