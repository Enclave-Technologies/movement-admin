import React, { useEffect, useState } from "react";
import GoalList from "../GoalList";
import axios from "axios";
import { API_BASE_URL } from "@/configs/constants";
import { useUser } from "@/context/ClientContext";
import { TrainerProvider } from "@/context/TrainerContext";
import WorkoutHistoryTable from "../WorkoutHistoryTable";
import WorkoutPlan from "./WorkoutPlan";
import { FaHistory } from "react-icons/fa";
import { MdChangeHistory } from "react-icons/md";
import { IoDocumentText, IoDocumentTextOutline } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import { IoIosBody } from "react-icons/io";
import BodyMassComposition from "./BodyMassComposition";
import Toast from "../Toast";
import { Tabs } from "./Tabs";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";

const ClientDetails = ({ client_id }) => {
    const { userData } = useUser();
    const [selectedTab, setSelectedTab] = useState("workout-history");
    const [goals, setGoals] = useState();
    const [sessionLog, setSessionLog] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [clientPhases, setClientPhases] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [fetchingWorkouts, setFetchingWorkouts] = useState(true);
    const [deletingSession, setDeletingSession] = useState(false);
    const [fetchingGoals, setFetchingGoals] = useState(true);
    const [nextSession, setNextSession] = useState(null);
    const [progressId, setProgressId] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    // Get the unsaved changes context
    const { hasUnsavedChanges, handleActionAttempt } = useUnsavedChanges();
    
    // Wrapper for safe tab switching that checks for unsaved changes
    const handleTabChange = (tabName) => {
        // Use the handleActionAttempt to safely handle tab changes
        handleActionAttempt(() => {
            setSelectedTab(tabName);
        });
    };

    async function fetchWorkoutPlan() {
        try {
            const clientPhases = await axios.get(
                `${API_BASE_URL}/mvmt/v1/client/phases?client_id=${client_id}`,
                { withCredentials: true }
            );
            const workouts = await axios.get(
                `${API_BASE_URL}/mvmt/v1/admin/exercises?limit=5000&approved=true`,
                { withCredentials: true }
            );
            setClientPhases(clientPhases.data.phases);
            setWorkouts(workouts.data.data);
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
        const { nextSession, sessionLogs, progressId } = clientPhases.data;
        setNextSession(nextSession?.[0]);
        const reversedLogs = sessionLogs.reverse();
        setSessionLog(reversedLogs);
        setProgressId(progressId);
        setFetchingWorkouts(false);
    }


    async function deleteSession(sessionId: string) {
        setDeletingSession(true);
        const response = await axios.delete(
            `${API_BASE_URL}/mvmt/v1/client/tracked-workouts/${sessionId}`,
            { withCredentials: true }
        );

        if (response.status === 200) {
            fetchTrackedWorkouts();
            setToastMessage("Session deleted successfully");
            setToastType("success");
            setShowToast(true);
            setDeletingSession(false);
        } else {
            setToastMessage(response.data.message || "Failed to delete session");
            setToastType("error");
            setShowToast(true);
            setDeletingSession(false);
        }
    }   

    const handleToastClose = () => {
        setShowToast(false);
    };

    useEffect(() => {
        fetchTrackedWorkouts();
        fetchWorkoutPlan();
        fetchGoals();
    }, []);

    return (
        <TrainerProvider>
            <div className="flex flex-col items-start w-full gap-0 bg-white rounded-xl overflow-visible shadow-md border border-gray-200">
                <Tabs
                    selectedTab={selectedTab}
                    setSelectedTab={handleTabChange}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onTabChangeAttempt={handleTabChange}
                />
                <div className="p-8 bg-white w-full rounded-b-xl">
                    {selectedTab == "workout-history" && (
                        <WorkoutHistoryTable
                            dataLoading={fetchingWorkouts}
                            handleViewSession={null}
                            sessions={sessionLog}
                            deleteSession={deleteSession}
                            deletingSession={deletingSession}
                        />
                    )}
                    {selectedTab == "goals" && (
                        <GoalList
                            pageLoading={fetchingGoals}
                            goals={goals}
                            setGoals={setGoals}
                            clientData={userData}
                            setShowToast={setShowToast}
                            setToastMessage={setToastMessage}
                            setToastType={setToastType}
                        />
                    )}
                    {selectedTab == "workout-plan" && (
                        <WorkoutPlan
                            pageLoading={dataLoading}
                            setPageLoading={setFetchingWorkouts}
                            fetchTrackedWorkouts={fetchTrackedWorkouts}
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
                    {selectedTab == "body-mass-composition" && (
                        <BodyMassComposition
                            client_id={client_id}
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
