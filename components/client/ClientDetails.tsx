import React, { useEffect, useState } from "react";
import GoalList from "../GoalList";
import axios from "axios";
import { API_BASE_URL } from "@/configs/constants";
import { useUser } from "@/context/ClientContext";
import { TrainerProvider } from "@/context/TrainerContext";
import SessionLogTable from "../SessionLogTable";
import WorkoutPlan from "./WorkoutPlan";

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

  useEffect(() => {
    setDataLoading(true);
    fetchTrackedWorkouts();
    fetchWorkoutPlan();
    fetchGoals();
  }, [client_id]);

  async function fetchWorkoutPlan() {
    try {
      const clientPhases = await axios.get(
        `${API_BASE_URL}/mvmt/v1/client/phases?client_id=${client_id}`,
        { withCredentials: true }
      );
      const workouts = await axios.get(
        `${API_BASE_URL}/mvmt/v1/trainer/workouts`,
        { withCredentials: true }
      );
      setClientPhases(clientPhases.data.phases);
      setWorkouts(workouts.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingWorkouts(false);
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
    // setNextSession(nextSession[0]);
    setSessionLog(sessionLogs);
    // setProgressId(progressId);
    setDataLoading(false);
  }

  return (
    <TrainerProvider>
      <div className="flex flex-col items-start w-full gap-2">
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <div className="p-4 bg-white w-full shadow-md rounded-lg overflow-hidden">
          {selectedTab == "workout-history" && (
            <SessionLogTable handleViewSession={null} sessions={sessionLog} />
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
              pageLoading={fetchingWorkouts}
              setPageLoading={setFetchingWorkouts}
              client_id={client_id}
              workouts={workouts}
              clientPhases={clientPhases}
              setClientPhases={setClientPhases}
            />
          )}
        </div>
      </div>
    </TrainerProvider>
  );
};

const Tabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="flex flex-row items-center justify-between bg-white rounded-lg w-full shadow-lg overflow-hidden">
      <Tab
        isSelected={selectedTab === "workout-history"}
        label={"Workout History"}
        onClick={() => {
          setSelectedTab("workout-history");
        }}
      />
      <Tab
        isSelected={selectedTab === "workout-plan"}
        label={"Workout Plan"}
        onClick={() => {
          setSelectedTab("workout-plan");
        }}
      />
      <Tab
        isSelected={selectedTab === "goals"}
        label={"Goals"}
        onClick={() => {
          setSelectedTab("goals");
        }}
      />
      <Tab
        isSelected={selectedTab === "body-mass-composition"}
        label={"Body Mass Composition"}
        onClick={() => {
          setSelectedTab("body-mass-composition");
        }}
      />
    </div>
  );
};

const Tab = ({ label, onClick, isSelected }) => {
  return (
    <div
      className={`hover:cursor-pointer flex-1 flex flex-row items-center justify-center py-4 ${
        isSelected ? "bg-green-500 text-white" : "bg-white"
      }`}
      onClick={onClick}
    >
      <p>{label}</p>
    </div>
  );
};

export default ClientDetails;
