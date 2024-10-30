"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import axios from "axios";
import BreadcrumbLoading from "@/components/BreadcrumbLoading";
import Breadcrumb from "@/components/Breadcrumb";
import { set } from "zod";
import useFetchWorkouts from "@/hooks/useFetchWorkouts";
import useTrainingPlanData from "@/hooks/useTrainingPlanData";
import { mapPhaseToDropdown } from "@/utils/mapPhaseToDropdown";
import CustomSelect from "@/components/CustomSelect";
import { MdAdd } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { GrCopy } from "react-icons/gr";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import SessionRenderer from "@/components/SessionRenderer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Page = () => {
    const page_title = ["Training Program"];
    const { userData } = useUser(); // Access the user data from Context
    const [pageLoading, setPageLoading] = useState(true);
    const allWorkouts = useFetchWorkouts();
    const { phases, sessions, exercises, loading } = useTrainingPlanData(
        userData?.id
    );
    const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>(
        []
    );
    const [mvmtSession, setMvmtSession] = useState<MovSession[]>([]);
    const [phaseData, setPhaseData] = useState<Phase[]>([]);
    const [phaseDropdownData, setPhaseDropdownData] = useState([]);

    const [selectedPhase, setSelectedPhase] = useState(null);
    const [selectedSessions, setSelectedSessions] = useState(null);
    const [selectedExercises, setSelectedExercises] = useState(null);

    useEffect(() => {
        if (phases) {
            setPhaseData(phases);
            const noPhaseOption = {
                value: "no-phases",
                label: "No Phases, Please Add",
                isActive: false,
            };
            const phaseDropdown = mapPhaseToDropdown(phases);
            if (phaseDropdown.length == 0) {
                phaseDropdown.push(noPhaseOption);
            }
            const selectedPhase =
                phaseDropdown.find((phase) => phase.isActive) ||
                phaseDropdown[0];
            console.log("Pre selected Phase", selectedPhase);
            setSelectedPhase(selectedPhase);
            setPhaseDropdownData(phaseDropdown);
            if (sessions) {
                const selSessions = sessions.filter((session) => {
                    return session.phases === selectedPhase.value;
                });
                setMvmtSession(sessions);
                setSelectedSessions(selSessions);
                if (exercises) {
                    setSessionExercises(exercises);
                }
            }
        }
    }, [phases, sessions, exercises]);

    useEffect(() => {
        if (userData) {
            setPageLoading(false);
        }
    }, [userData]);

    if (!userData || pageLoading)
        return (
            <div>
                <div className="ml-12">
                    <BreadcrumbLoading />
                </div>
                Loading
            </div>
        );

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="ml-12">
                <Breadcrumb
                    homeImage={userData?.imageUrl}
                    homeTitle={userData?.name}
                    customTexts={page_title}
                />
            </div>
            {/*
            
            Dropdown and buttons for Phase selection and management
            
            */}
            <div>
                <CustomSelect
                    options={phaseDropdownData}
                    onChange={(e) => {
                        console.log(e);
                    }}
                    selectedOption={selectedPhase}
                />
                <div className="flex items-center h-12 justify-between w-full gap-1">
                    {selectedPhase?.value === "no-phases" && (
                        <div
                            className="flex w-1/4 h-full items-center 
                    select-none justify-center text-white font-semibold
                     bg-green-500 hover:bg-green-900
                      hover:cursor-pointer hover:text-white
                     rounded-xl p-1 gap-2"
                        >
                            <MdAdd className="text-2xl" /> Add
                        </div>
                    )}

                    {selectedPhase?.value != "no-phases" && (
                        <div
                            className="flex w-1/4 h-full items-center 
                    select-none justify-center text-white font-semibold
                     bg-green-500 active:bg-gold-500
                      hover:cursor-pointer hover:text-white
                     rounded-xl p-1 gap-2 whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            <GrCopy className="text-2xl" />{" "}
                            {selectedPhase.label}
                        </div>
                    )}

                    {selectedPhase?.value != "no-phases" &&
                        selectedPhase?.isActive === false && (
                            <div
                                className="flex w-1/4 h-full items-center 
                    select-none justify-center text-white font-semibold
                     bg-green-500 active:bg-gold-500
                      hover:cursor-pointer hover:text-white
                     rounded-xl p-1 gap-2"
                            >
                                <IoCheckmarkDoneSharp className="text-2xl" />{" "}
                                Activate
                            </div>
                        )}

                    {selectedPhase?.value != "no-phases" && (
                        <div
                            className="flex w-1/4 h-full items-center 
                    select-none justify-center text-white font-semibold
                     bg-red-500 hover:bg-red-700
                      hover:cursor-pointer hover:text-white
                     rounded-xl p-1 gap-2"
                        >
                            <FaTrashAlt className="text-2xl" />
                            Remove
                        </div>
                    )}
                </div>
            </div>

            {/* SESSION MANAGEMENT */}
            <div>
                <SessionRenderer
                    sessions={
                        phaseData.find(
                            (phase) => phase.id === selectedPhase.value
                        )?.sessions || []
                    }
                />
            </div>
        </div>
    );
};

export default Page;
