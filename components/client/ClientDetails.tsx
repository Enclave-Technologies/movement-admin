import React, { useEffect, useState } from "react";
import GoalList from "../GoalList";
import axios from "axios";
import { API_BASE_URL } from "@/configs/constants";
import { useUser } from "@/context/ClientContext";
import { TrainerProvider } from "@/context/TrainerContext";
import SessionLogTable from "../SessionLogTable";
import WorkoutPlan from "./WorkoutPlan";
import { FaHistory } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import Toast from "../Toast";
import { Tabs } from "./Tabs";

const ClientDetails = ({ client_id }) => {
    const { userData } = useUser();
    const [selectedTab, setSelectedTab] = useState("workout-history");
    const [goals, setGoals] = useState();
    const [sessionLog, setSessionLog] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [clientPhases, setClientPhases] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [fetchingWorkouts, setFetchingWorkouts] = useState(true);
    const [fetchingGoals, setFetchingGoals] = useState(true);
    const [nextSession, setNextSession] = useState(null);
    const [progressId, setProgressId] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        fetchTrackedWorkouts();
        fetchWorkoutPlan();
        fetchGoals();
    }, []);

    async function fetchWorkoutPlan() {
        try {
            const clientPhases = await axios.get(
                `${API_BASE_URL}/mvmt/v1/client/phases?client_id=${client_id}`,
                { withCredentials: true }
            );
            const workouts = await axios.get(
                `${API_BASE_URL}/mvmt/v1/admin/exercises?limit=1000&approved=true`,
                { withCredentials: true }
            );
            setClientPhases(clientPhases.data.phases);
            setWorkouts(workouts.data);
        } catch (error) {
            console.error(error);
        } finally {
            setDataLoading(false);
        }
    }

    async function fetchGoals() {
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/client/goals?client_id=${client_id}`,
            { withCredentials: true }
        );
        const data = response.data;
        setGoals(data);
        setFetchingGoals(false);
    }

    async function fetchTrackedWorkouts() {
        const clientPhases = await axios.get(
            `${API_BASE_URL}/mvmt/v1/client/tracked-workouts?client_id=${client_id}`,
            { withCredentials: true }
        );

        console.log(clientPhases.data);

        const { nextSession, sessionLogs, progressId } = clientPhases.data;
        setNextSession(nextSession?.[0]);
        const reversedLogs = sessionLogs.reverse();
        setSessionLog(reversedLogs);
        setProgressId(progressId);
        setFetchingWorkouts(false);
    }

    const handleToastClose = () => {
        setShowToast(false);
    };

    return (
        <TrainerProvider>
            <div className="flex flex-col items-start w-full gap-0 bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                <Tabs
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                />
                <div className="p-8 bg-white w-full">
                    {selectedTab == "workout-history" && (
                        <SessionLogTable
                            dataLoading={fetchingWorkouts}
                            handleViewSession={null}
                            sessions={sessionLog}
                        />
                    )}
                    {selectedTab == "goals" && (
                        <GoalList
                            pageLoading={fetchingGoals}
                            goals={goals}
                            setGoals={setGoals}
                            clientData={userData}
                        />
                    )}
                    {selectedTab == "workout-plan" && (
                        <WorkoutPlan
                            pageLoading={dataLoading}
                            setPageLoading={setFetchingWorkouts}
                            client_id={client_id}
                            workouts={workouts}
                            clientPhases={clientPhases}
                            setClientPhases={setClientPhases}
                            nextSession={nextSession}
                            progressId={progressId}
                            setShowToast={setShowToast}
                            setToastMessage={setToastMessage}
                            setToastType={setToastType}
                        />
                    )}
                    {showToast && (
                        <Toast
                            message={toastMessage}
                            onClose={handleToastClose}
                            type={toastType}
                        />
                    )}
                </div>
            </div>
        </TrainerProvider>
    );
};

export default ClientDetails;
