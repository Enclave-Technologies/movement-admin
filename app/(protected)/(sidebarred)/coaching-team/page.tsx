"use client";

import Searchbar from "@/components/pure-components/Searchbar";
import TrainerTable from "@/components/TrainerTable";
import { API_BASE_URL } from "@/configs/constants";
import RightModal from "@/components/pure-components/RightModal";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { LIMIT } from "@/configs/constants";
import Pagination from "@/components/pure-components/Pagination";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserSkeleton from "@/components/pageSkeletons/userSkeleton";
import { fetchUserDetails } from "@/server_functions/auth";

const CoachingTeam = () => {
    const [allTrainers, setAllTrainers] = useState([]);
    const [pageNo, setPageNo] = useState<number>(1); // State to hold the last ID of the fetched clients
    const [totalPages, setTotalPages] = useState<number>(1); // State to hold the last ID of the fetched clients
    const [pageLoading, setPageLoading] = useState(true);
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [search, setSearch] = useState("");
    const [showRightModal, setShowRightModal] = useState(false);
    const { countDoc, trainers, reloadData } = useGlobalContext();

    async function loadData(pageNo) {
        setPageLoading(true);
        setTotalPages(Math.ceil(countDoc.trainers_count / LIMIT));
        const details = await fetchUserDetails();
        setTrainerDetails(details);
        if (pageNo === 1) {
            setAllTrainers(trainers);
        } else {
            const allTrainers = await axios.get(
                `${API_BASE_URL}/mvmt/v1/admin/trainerIds?pageNo=${pageNo}&limit=${LIMIT}`,
                {
                    withCredentials: true, // Include cookies in the request
                }
            );
            setAllTrainers(allTrainers.data);
        }
        setPageLoading(false);
    }

    useEffect(() => {
        if (countDoc && trainers) {
            loadData(pageNo);
        }
    }, [pageNo, countDoc, trainers]);

    const rightModal = () => {
        return (
            <RightModal
                formTitle="Add Trainer / Admin"
                isVisible={showRightModal}
                hideModal={() => {
                    setShowRightModal(false);
                }}
            >
                <div className="h-4 w-4 bg-black"></div>
            </RightModal>
        );
    };

    if (pageLoading) {
        return (
            <UserSkeleton
                button_text="Add Trainer"
                pageTitle="Coaching Team"
                buttons={totalPages}
            />
        );
    }

    return (
        <main className="flex flex-col bg-gray-100 text-black">
            <div className="w-full flex flex-col gap-4">
                <Searchbar search={search} setSearch={setSearch} />

                <div className="w-full flex flex-row items-center justify-between">
                    <h1 className="text-xl font-bold text-black ml-2 leading-tight">
                        Coaching Team
                    </h1>
                    {trainerDetails?.team.name === "Admins" && (
                        <button
                            onClick={() => {
                                setShowRightModal(true);
                            }}
                            className="bg-primary text-white py-2 px-4 rounded-md"
                        >
                            + Add Trainer
                        </button>
                    )}
                </div>
                {/* <pre>{JSON.stringify(trainerDetails)}</pre> */}
                <div className="w-full overflow-x-auto">
                    <TrainerTable search={search} trainers={allTrainers} />
                </div>

                <Pagination
                    totalPages={totalPages}
                    pageNo={pageNo}
                    handlePageChange={(page: number) => {
                        setPageNo(page);
                    }}
                />
                {rightModal()}
            </div>
        </main>
    );
};

export default CoachingTeam;
