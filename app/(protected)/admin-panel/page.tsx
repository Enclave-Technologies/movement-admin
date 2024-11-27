"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  addWorkout,
  fetchUserDetails,
  register,
  registerClient,
} from "@/server_functions/auth";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from "react-accessible-accordion";
import { useFormState } from "react-dom";
import Toast from "@/components/Toast";
import Spinner from "@/components/Spinner";
import RegisterForm from "@/components/RegisterForm";
import AddClientForm from "@/components/AddClientForm";
import axios from "axios";
import AddExerciseForm from "@/components/AddExerciseForm";
import TrainerTable from "@/components/TrainerTable";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AdminPanel = () => {
  const [state, action] = useFormState(register, undefined);
  const [clientState, clientAction] = useFormState(registerClient, undefined);
  const [exerciseState, exerciseAction] = useFormState(addWorkout, undefined);
  const [pageLoading, setPageLoading] = useState(true);
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [allTrainers, setAllTrainers] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(10);
  const [updatingExercise, setUpdatingExercise] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);
  const refClientForm = useRef<HTMLFormElement>(null);
  const refWorkoutForm = useRef<HTMLFormElement>(null);

  const loadData = useCallback(async () => {
    try {
      const details = await fetchUserDetails();
      setTrainerDetails(details);
      const allTrainers = await axios.get(
        `${API_BASE_URL}/mvmt/v1/admin/trainerIds`,
        {
          withCredentials: true, // Include cookies in the request
        }
      );
      setAllTrainers(allTrainers.data);

      const allExercises = await axios.get(
        `${API_BASE_URL}/mvmt/v1/admin/exercises`,
        {
          withCredentials: true,
        }
      );
      setAllExercises(allExercises.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, []);

  useEffect(() => {
    // async function loadData() {
    //     try {
    //         setPageLoading(true);
    //         const details = await fetchUserDetails();
    //         setTrainerDetails(details);
    //         const allTrainers = await axios.get(
    //             `${API_BASE_URL}/mvmt/v1/admin/trainerIds`,
    //             {
    //                 withCredentials: true, // Include cookies in the request
    //             }
    //         );

    //         setAllTrainers(allTrainers.data);

    //         const allExercises = await axios.get(
    //             `${API_BASE_URL}/mvmt/v1/admin/exercises`,
    //             {
    //                 withCredentials: true,
    //             }
    //         );

    //         setAllExercises(allExercises.data);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setPageLoading(false);
    //     }
    // }
    setPageLoading(true);
    loadData();
    setPageLoading(false);
  }, [loadData]);

  const handleApprovalChange = async (
    exerciseId: string,
    approved: boolean
  ) => {
    setUpdatingExercise(exerciseId);

    try {
      console.log(typeof approved);
      const response = await axios.put(
        `${API_BASE_URL}/mvmt/v1/admin/exercises/${exerciseId}`,
        {
          approved,
        },
        {
          withCredentials: true,
        }
      );

      // Update the local state with the new approved value
      setAllExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise.$id === exerciseId ? { ...exercise, approved } : exercise
        )
      );
    } catch (error) {
      console.error("Error updating exercise approval:", error);
    } finally {
      setUpdatingExercise(null);
    }
  };

  // Calculate the current exercise range
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = allExercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (state?.success) {
      loadData();
      ref.current?.reset();
      setToastMessage(state.message || "Trainer registered successfully!");
      setToastType("success");
      setShowToast(true);
    } else if (state?.errors) {
      setToastMessage(Object.values(state.errors).flat().join(", "));
      setToastType("error");
      setShowToast(true);
    }
  }, [state]);

  useEffect(() => {
    if (clientState?.success) {
      refClientForm.current?.reset();
      setToastMessage(clientState.message || "User registered successfully!");
      setToastType("success");
      setShowToast(true);
    } else if (clientState?.errors) {
      setToastMessage(Object.values(clientState.errors).flat().join(", "));
      setToastType("error");
      setShowToast(true);
    }
  }, [clientState]);

  useEffect(() => {
    if (exerciseState?.success) {
      loadData();
      refWorkoutForm.current?.reset();
      setToastMessage(
        exerciseState.message || "Exercise registered successfully!"
      );
      setToastType("success");
      setShowToast(true);
    } else if (exerciseState?.errors) {
      setToastMessage(Object.values(exerciseState.errors).flat().join(", "));
      setToastType("error");
      setShowToast(true);
    }
  }, [exerciseState]);

  const handleToastClose = () => {
    setShowToast(false);
  };

  if (pageLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center items-center w-full">
      <Accordion className="w-full" allowZeroExpanded preExpanded={["client"]}>
        {/* Add trainers and admins accordion (ADMIN ONLY) */}
        {trainerDetails?.team.name === "Admins" && (
          <AccordionItem uuid="admin" className="mt-1">
            <AccordionItemHeading>
              <AccordionItemButton className="bg-green-500 flex justify-between items-center py-4 px-6 text-white hover:bg-green-900 transition-colors rounded-t-lg duration-300 focus:outline-none focus-visible:ring focus-visible:ring-green-700 focus-visible:ring-opacity-75">
                <div className="flex items-center">
                  <AccordionItemState>
                    {({ expanded }) => (
                      <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${
                          expanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </AccordionItemState>
                  <span className="text-lg font-bold ml-4">
                    Register Trainer / Admin
                  </span>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
                <RegisterForm action={action} ref={ref} state={state} />
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        )}

        {/* Add client accordion */}
        <AccordionItem uuid="client" className="mt-1">
          <AccordionItemHeading>
            <AccordionItemButton className="bg-green-500 flex justify-between items-center py-4 px-6 text-white hover:bg-green-900 transition-colors rounded-t-lg duration-300 focus:outline-none focus-visible:ring focus-visible:ring-green-700 focus-visible:ring-opacity-75">
              <div className="flex items-center">
                <AccordionItemState>
                  {({ expanded }) => (
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </AccordionItemState>
                <span className="text-lg font-bold ml-4">Add Client</span>
              </div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
              <AddClientForm
                action={clientAction}
                state={clientState}
                allTrainers={allTrainers}
                ref={refClientForm}
              />
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        {/* Add exercise accordion */}
        <AccordionItem uuid="exercise" className="mt-1">
          <AccordionItemHeading>
            <AccordionItemButton className="bg-green-500 flex justify-between items-center py-4 px-6 text-white hover:bg-green-900 transition-colors rounded-t-lg duration-300 focus:outline-none focus-visible:ring focus-visible:ring-green-700 focus-visible:ring-opacity-75">
              <div className="flex items-center">
                <AccordionItemState>
                  {({ expanded }) => (
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </AccordionItemState>
                <span className="text-lg font-bold ml-4">Add Exercise</span>
              </div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
              <AddExerciseForm
                action={exerciseAction}
                state={exerciseState}
                ref={refWorkoutForm}
              />
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        {/* Approve Exercise accordion (ADMIN ONLY) */}
        {trainerDetails?.team.name === "Admins" && (
          <AccordionItem uuid="exerciseApprove" className="mt-1">
            <AccordionItemHeading>
              <AccordionItemButton className="bg-green-500 flex justify-between items-center py-4 px-6 text-white hover:bg-green-900 transition-colors rounded-t-lg duration-300 focus:outline-none focus-visible:ring focus-visible:ring-green-700 focus-visible:ring-opacity-75">
                <div className="flex items-center">
                  <AccordionItemState>
                    {({ expanded }) => (
                      <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${
                          expanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </AccordionItemState>
                  <span className="text-lg font-bold ml-4">
                    Registered Exercise List
                  </span>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="p-6 bg-gray-50 shadow-lg rounded-lg w-full">
                <div className="flex justify-center mb-6">
                  <nav aria-label="Page navigation">
                    <ul className="inline-flex -space-x-px">
                      {Array.from(
                        {
                          length: Math.ceil(
                            allExercises.length / exercisesPerPage
                          ),
                        },
                        (_, i) => i + 1
                      ).map((page) => (
                        <li key={page}>
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-md transition-colors ${
                              currentPage === page
                                ? "bg-green-500 text-white hover:bg-green-900"
                                : "bg-white text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                <div className="rounded-lg overflow-x-auto">
                  <table className="w-full uppercase">
                    <thead className="bg-green-500 text-white font-bold">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-4">Motion</th>
                        <th className="whitespace-nowrap px-4">
                          Specific Description
                        </th>
                        <th className="whitespace-nowrap px-4">
                          Short Description
                        </th>
                        <th className="whitespace-nowrap px-4">
                          Recommended Reps
                        </th>
                        <th className="whitespace-nowrap px-4">
                          Recommended Sets
                        </th>
                        <th className="whitespace-nowrap px-4">Tempo</th>
                        <th className="whitespace-nowrap px-4">TUT</th>
                        <th className="whitespace-nowrap px-4">
                          Recommended Rest
                        </th>
                        <th className="sticky right-0 bg-green-500 z-10 px-4">
                          <div className="inline-block whitespace-nowrap">
                            Approved
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentExercises.map((exercise) => (
                        <tr key={exercise.$id}>
                          <td className="whitespace-nowrap justify-center px-4 py-2">
                            {exercise.Motion}
                          </td>
                          <td className="whitespace-nowrap justify-center px-4 py-2">
                            {exercise.SpecificDescription}
                          </td>
                          <td className="whitespace-nowrap justify-center px-4 py-2">
                            {exercise.ShortDescription}
                          </td>
                          <td className="whitespace-nowrap text-center px-4 py-2">
                            {exercise.RecommendedRepsMin} -{" "}
                            {exercise.RecommendedRepsMax}
                          </td>
                          <td className="whitespace-nowrap text-center px-4 py-2">
                            {exercise.RecommendedSetsMin} -{" "}
                            {exercise.RecommendedSetsMax}
                          </td>
                          <td className="whitespace-nowrap text-center px-4 py-2">
                            {exercise.Tempo}
                          </td>
                          <td className="whitespace-nowrap text-center px-4 py-2">
                            {exercise.TUT}
                          </td>
                          <td className="whitespace-nowrap  text-center px-4 py-2">
                            {exercise.RecommendedRestMin} -{" "}
                            {exercise.RecommendedRestMax}
                          </td>
                          <td className="sticky right-0 bg-gray-50 z-10 px-0 py-2">
                            <select
                              className="w-full whitespace-nowrap  py-3"
                              value={exercise.approved}
                              onChange={(e) =>
                                handleApprovalChange(
                                  exercise.$id,
                                  e.target.value === "true"
                                )
                              }
                              disabled={updatingExercise === exercise.$id}
                            >
                              <option value="true">Approved</option>
                              <option value="false">Not Approved</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        )}

        {/* All Trainers accordion (ADMIN ONLY) */}
        {trainerDetails?.team.name === "Admins" && (
          <AccordionItem uuid="trainerList" className="mt-1">
            <AccordionItemHeading>
              <AccordionItemButton className="bg-green-500 flex justify-between items-center py-4 px-6 text-white hover:bg-green-900 transition-colors rounded-t-lg duration-300 focus:outline-none focus-visible:ring focus-visible:ring-green-700 focus-visible:ring-opacity-75">
                <div className="flex items-center">
                  <AccordionItemState>
                    {({ expanded }) => (
                      <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${
                          expanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </AccordionItemState>
                  <span className="text-lg font-bold ml-4">Trainer List</span>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <TrainerTable pageTitle={""} trainers={allTrainers} />
            </AccordionItemPanel>
          </AccordionItem>
        )}
      </Accordion>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={handleToastClose}
          type={toastType}
        />
      )}
    </div>
  );
};

export default AdminPanel;
