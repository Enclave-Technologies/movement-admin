import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { useRouter } from "next/navigation";

const WorkoutRecordHeader = ({ phaseName, sessionName, startTime }) => {
    const router = useRouter();

    const handleSave = () => {
        // SAVE THE DATA
        router.push("/");
    };

    const [time, setTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                onClick={handleSave}
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
                    className="save-button border border-solid rounded-xl px-6 py-2 text-white bg-green-500 hover:bg-green-500"
                    onClick={handleSave}
                    aria-label="Save"
                >
                    SAVE
                </button>
            </div>
        </div>
    );
};

export default WorkoutRecordHeader;
