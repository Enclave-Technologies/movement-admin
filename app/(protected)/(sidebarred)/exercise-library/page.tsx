"use client";
import { API_BASE_URL } from "@/configs/constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ExercisesTable from "@/components/ExercisesTable";
import Searchbar from "@/components/pure-components/Searchbar";

const ExerciseLibrary = () => {
  const [allExercises, setAllExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(10);
  const [pageLoading, setPageLoading] = useState(false);
  const [search, setSearch] = useState("");

  const currentExercises = useMemo(() => {
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    return allExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  }, [allExercises, currentPage, exercisesPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const loadData = useCallback(async () => {
    try {
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
    setPageLoading(true);
    loadData();
    setPageLoading(false);
  }, [loadData]);

  if (pageLoading) {
    return <Spinner />;
  }

  return (
    <main className="flex flex-col bg-gray-100 text-black">
      <div className="w-full flex flex-col gap-4">
        <Searchbar search={search} setSearch={setSearch} />
        <span className="text-lg font-bold ml-4">Registered Exercise List</span>
        {/* <div className="p-6 bg-gray-50 shadow-lg rounded-lg w-full">
        <div className="flex justify-center mb-6">
          <nav aria-label="Page navigation">
            <ul className="inline-flex -space-x-px">
              {Array.from(
                {
                  length: Math.ceil(allExercises.length / exercisesPerPage),
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
        </div> */}
        <ExercisesTable
          search={search}
          setSearch={setSearch}
          exercises={currentExercises}
        />
      </div>
    </main>
  );
};

export default ExerciseLibrary;
