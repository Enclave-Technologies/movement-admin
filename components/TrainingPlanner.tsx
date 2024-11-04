import React, { useEffect, useState } from "react";
import TrainingPlanData from "@/server_functions/TrainingPlanData";
import PhaseSelector from "./PhaseSelector";
import { mapPhaseToDropdown } from "@/utils/mapPhaseToDropdown";
import { MdAdd, MdEditSquare } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { GrCopy } from "react-icons/gr";
import SessionRenderer from "./SessionRenderer";

const TrainingPlanner = ({
    clientId,
    setPageLoading,
}: {
    clientId: string;
    setPageLoading: any;
}) => {
    const [phases, setPhases] = useState<Phase[]>([]);
    const [selectedPhase, setSelectedPhase] =
        useState<PhaseDropdownOption | null>(null);
    const [phaseDropdownData, setPhaseDropdownData] = useState<
        PhaseDropdownOption[]
    >([]);
    // const selectedData = phases.find((p) => p.id === selectedPhase.value);

    useEffect(() => {
        setPageLoading(true);
        const fetchData = async () => {
            try {
                const data = await TrainingPlanData(clientId);
                setPhases(data.phases);

                const noPhaseOption = {
                    value: "no-phases",
                    label: "No Phases, Please Add",
                    isActive: false,
                };
                const phaseDropdown = mapPhaseToDropdown(data.phases);
                if (phaseDropdown.length == 0) {
                    phaseDropdown.push(noPhaseOption);
                }
                const tempSelPhase =
                    phaseDropdown.find((phase) => phase.isActive) ||
                    phaseDropdown[0];
                console.log("Pre selected Phase", selectedPhase);
                if (!selectedPhase) {
                    setSelectedPhase(tempSelPhase);
                }
                setPhaseDropdownData(phaseDropdown);
            } catch (error) {
                console.error("Error fetching training plan data:", error);
            }
        };

        console.log("ClientID or Phases changed, calling fetch Data");
        fetchData();
        setPageLoading(false);
    }, [clientId, phases]);

    return (
        <div>
            <div className="flex h-10 items-center justify-between">
                <PhaseSelector
                    selectedOption={selectedPhase}
                    options={phaseDropdownData}
                    onChange={(e) => {
                        const selectedPhase = phaseDropdownData.find(
                            (phase) => phase.value === e
                        );
                        setSelectedPhase(selectedPhase || null);
                    }}
                />
                <div
                    className="flex w-1/5 h-full items-center 
                select-none justify-center text-white font-semibold
                bg-green-500 hover:bg-green-900
                hover:cursor-pointer hover:text-white
                rounded-xl p-1 gap-2"
                >
                    <MdEditSquare className="text-2xl" />{" "}
                    <span className="hidden lg:flex">Rename</span>
                </div>
            </div>
            <div className="flex items-center h-12 justify-between w-full gap-1 m-1 p-1">
                <div
                    className="flex w-1/5 h-full items-center 
                    select-none justify-center text-white font-semibold
                     bg-green-500 hover:bg-green-900
                      hover:cursor-pointer hover:text-white
                     rounded-xl p-1 gap-2"
                >
                    <MdAdd className="text-2xl" />{" "}
                    <span className="hidden lg:flex">Add</span>
                </div>
                {/* )} */}

                {selectedPhase?.value != "no-phases" && (
                    <div
                        className="flex w-1/5 h-full items-center 
                    select-none justify-center text-white font-semibold
                     bg-green-500 active:bg-gold-500
                      hover:cursor-pointer hover:text-white
                     rounded-xl p-1 gap-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        <GrCopy className="text-2xl" />
                        <span className="hidden lg:flex">
                            {/* {selectedPhase.label} */}
                            Duplicate
                        </span>
                    </div>
                )}

                {selectedPhase?.value != "no-phases" &&
                    selectedPhase?.isActive === false && (
                        <div
                            className="flex w-1/5 h-full items-center 
                    select-none justify-center text-white font-semibold
                     bg-green-500 active:bg-gold-500
                      hover:cursor-pointer hover:text-white
                     rounded-xl p-1 gap-2"
                        >
                            <IoCheckmarkDoneSharp className="text-2xl" />{" "}
                            <span className="hidden lg:flex">Activate</span>
                        </div>
                    )}

                {selectedPhase?.value != "no-phases" && (
                    <div
                        className="flex w-1/5 h-full items-center 
                    select-none justify-center text-white font-semibold
                     bg-red-500 hover:bg-red-700
                      hover:cursor-pointer hover:text-white
                     rounded-xl p-1 gap-2"
                    >
                        <FaTrashAlt className="text-2xl" />
                        <span className="hidden lg:flex">Remove</span>
                    </div>
                )}
            </div>

            <div>
                <SessionRenderer
                    selectedPhase={phases.find(
                        (phase) => phase.id === selectedPhase.value
                    )}
                    phases={phases}
                    setPhases={setPhases}
                />
            </div>
        </div>
    );
};

export default TrainingPlanner;
