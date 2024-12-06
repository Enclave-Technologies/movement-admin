"use client";
import { API_BASE_URL } from "@/configs/constants";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ExercisesTable from "@/components/ExercisesTable";
import Searchbar from "@/components/pure-components/Searchbar";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { LIMIT } from "@/configs/constants";
import RightModal from "@/components/pure-components/RightModal";
import UserSkeleton from "@/components/pageSkeletons/userSkeleton";
import Pagination from "@/components/pure-components/Pagination";
import { fetchUserDetails } from "@/server_functions/auth";
import AddExerciseForm from "@/components/forms/add-exercise-form";

const ExerciseLibrary = () => {
    const [allExercises, setAllExercises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState<number>(1); // State to hold the last ID of the fetched clients
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [showRightModal, setShowRightModal] = useState(false);
    const { countDoc, exercises, reloadData } = useGlobalContext();

    const fetchData = async () => {
        setPageLoading(true);
        setTotalPages(Math.ceil(countDoc.exercises_count / LIMIT));
        const details = await fetchUserDetails();
        setTrainerDetails(details);
        if (currentPage === 1) {
            setAllExercises(exercises);
        } else {
            const response = await axios.get(
                `${API_BASE_URL}/mvmt/v1/admin/exercises?pageNo=${currentPage}&limit=${LIMIT}`,
                {
                    withCredentials: true, // Include cookies in the request
                }
            );
            const newItems = response.data;
            setAllExercises(newItems);
        }
        setPageLoading(false);
    };

    useEffect(() => {
        if (countDoc && exercises) {
            fetchData();
        }
    }, [currentPage, countDoc]);

    const rightModal = () => {
        return (
            <RightModal
                formTitle="Add Exercise"
                isVisible={showRightModal}
                hideModal={() => {
                    setShowRightModal(false);
                }}
            >
                <AddExerciseForm
                    fetchData={reloadData}
                    team={trainerDetails?.team.name}
                />
            </RightModal>
        );
    };

    if (pageLoading)
        return (
            <UserSkeleton
                button_text="Add Exercise"
                pageTitle="Exercise List"
                buttons={totalPages}
                active_page={currentPage}
                tableHeaders={[
                    "Motion",
                    "Target Area",
                    "Exercise",
                    "Shortend Name",
                    "Approved",
                ]}
                searchLoadingText="Search by motion, target area or name"
            />
        );

    return (
        <main className="flex flex-col bg-gray-100 text-black">
            <div className="w-full flex flex-col gap-4">
                {/* <Searchbar
                    search={search}
                    setSearch={setSearch}
                    placeholder="Search by motion, target area or name"
                /> */}
                <div className="w-full flex flex-row items-center justify-between">
                    <span className="text-lg font-bold ml-4">
                        Exercise List
                    </span>
                    <button
                        onClick={() => {
                            setShowRightModal(true);
                        }}
                        className="bg-primary text-white py-2 px-4 rounded-md"
                    >
                        + Add Exercise
                    </button>
                </div>
                <div className="w-full overflow-x-auto">
                    <ExercisesTable
                        search={search}
                        exercises={allExercises}
                        trainerDetails={trainerDetails}
                        setAllExercises={setAllExercises}
                    />
                </div>

                <Pagination
                    totalPages={totalPages}
                    pageNo={currentPage}
                    handlePageChange={(page: number) => {
                        setCurrentPage(page);
                    }}
                />
                {rightModal()}
            </div>
        </main>
    );
};

export default ExerciseLibrary;
