"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AddExerciseModal from "@/components/AddExerciseModal";
import BreadcrumbLoading from "@/components/BreadcrumbLoading";
import EditableRow from "@/components/EditableRow";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Page = ({ params }: { params: { id: string; phid: string } }) => {
    const { userData, setUserData } = useUser();
    const [pageLoading, setPageLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exerciseList, setExerciseList] = useState<SessionExercise[]>([]);
    const [allWorkouts, setAllWorkouts] = useState<WorkoutData[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    // const handleModalOpen = () => {
    //     setIsModalOpen(true);
    // };

    // const handleModalClose = () => {
    //     setIsModalOpen(false);
    // };
    const handleAddExercise = () => {
        const firstWorkout = allWorkouts[0];
        setExerciseList([
            ...exerciseList,
            {
                exerciseOrder: exerciseList.length + 1,
                motion: firstWorkout.Motion,
                specificDescription: firstWorkout.SpecificDescription,
                repsMin: firstWorkout.RecommendedRepsMin,
                repsMax: firstWorkout.RecommendedRepsMax,
                setsMin: firstWorkout.RecommendedSetsMin,
                setsMax: firstWorkout.RecommendedSetsMax,
                exercises: firstWorkout.id,
                id: "",
                sessions: "",
                restMax: firstWorkout.RecommendedRestMax,
                restMin: firstWorkout.RecommendedRestMin,
                tempo: firstWorkout.Tempo,
                TUT: firstWorkout.TUT,
            },
        ]);
        setIsEditing(true);
    };
    const handleBack = () => {
        router.back();
    };
    const handleFormSubmit = (data: any) => {
        // Handle form submission, e.g., send data to API
        console.log("Submitted data:", data);
    };
    const searchParams = useSearchParams();
    // Extract the phaseTitle and sessions from the query parameters
    const phaseTitle = searchParams.get("phaseTitle") || "Phase 1";
    const page_title = ["Training Program", phaseTitle, "Add Session"];

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/client?client_id=${params.id}`,
                    { withCredentials: true }
                );
                if (isMounted) {
                    setUserData(response.data);
                    setPageLoading(false); // Set loading to false after data is fetched
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (isMounted) {
                    setPageLoading(false); // Set loading to false in case of error
                }
            }
        };

        const getAllExercises = async () => {
            try {
                // TODO: DB CONNECTION
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/workouts`,

                    { withCredentials: true }
                );
                const allExercises: WorkoutData[] = response.data;
                setAllWorkouts(allExercises);
            } catch (error) {
                console.log(error);
            }
        };

        setPageLoading(true); // Set loading to true before fetching data

        if (!userData) {
            fetchData();
            getAllExercises();
        } else {
            getAllExercises();
            setPageLoading(false); // Set loading to false if userData is already available
        }

        return () => {
            isMounted = false; // Cleanup function to prevent state updates on unmounted components
        };
    }, [params.id, setUserData, userData]);

    return pageLoading ? (
        <div>
            <BreadcrumbLoading />
        </div>
    ) : (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Session Title</h1>
                <input
                    type="text"
                    placeholder="Session 1: Upper Body Workout"
                    className="border border-gray-300 rounded p-2 w-full mb-6"
                />

                <h2 className="text-xl font-semibold mb-2">Session Time</h2>
                <input
                    type="text"
                    placeholder="40 minutes"
                    className="border border-gray-300 rounded p-2 w-full mb-6"
                />
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-2">Exercises</h2>
                </div>

                <div className=" p-4">
                    <table className="w-full ">
                        <thead className="bg-green-500 text-white">
                            <tr>
                                <th>Order</th>
                                <th>Motion</th>
                                <th>Specific Description</th>
                                <th>Reps Min</th>
                                <th>Reps Max</th>
                                <th>Sets Min</th>
                                <th>Sets Max</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exerciseList.map((exercise, index) => (
                                <EditableRow
                                    key={index}
                                    rowData={exercise}
                                    onSave={(editedData) => {
                                        // Handle save logic
                                        const updatedExerciseList = [
                                            ...exerciseList,
                                        ];
                                        updatedExerciseList[index] = editedData;
                                        setExerciseList(updatedExerciseList);
                                    }}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                    allWorkouts={allWorkouts}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {exerciseList.length === 0 ? (
                    <div className="text-center my-6">
                        <p>No Exercises added to this session yet.</p>
                        <p>Click on + Add Exercise to start adding exercises</p>
                    </div>
                ) : (
                    <></>
                )}

                <Link
                    href="#"
                    className="text-green-500 mb-4 inline-block w-full 
                    border-2 p-2 rounded-lg text-center"
                    onClick={handleAddExercise}
                >
                    + Add Exercise
                </Link>
                <div className="flex justify-between w-full items-center">
                    <Link
                        href="#"
                        onClick={handleBack}
                        className="bg-gray-500 text-white py-2 px-4 rounded inline-block hover:bg-gray-700"
                    >
                        Back
                    </Link>

                    <Link
                        href="#"
                        className="bg-green-500 text-white py-2 px-4 rounded inline-block hover:bg-green-900"
                    >
                        Save
                    </Link>
                </div>
            </div>

            {/* <AddExerciseModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleFormSubmit}
            /> */}
        </div>
    );
};

export default Page;
