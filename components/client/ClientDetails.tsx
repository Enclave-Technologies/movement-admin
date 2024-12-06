import React, { useEffect, useState } from "react";
import GoalList from "../GoalList";
import axios from "axios";
import { API_BASE_URL } from "@/configs/constants";
import { useUser } from "@/context/ClientContext";
import { TrainerProvider } from "@/context/TrainerContext";
import SessionLogTable from "../SessionLogTable";
import WorkoutPlan from "./WorkoutPlan";
import { FaHistory } from "react-icons/fa";
import { MdChangeHistory } from "react-icons/md";
import { IoDocumentText, IoDocumentTextOutline } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import { IoIosBody } from "react-icons/io";
import BodyMassComposition from "./BodyMassComposition";

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
        `${API_BASE_URL}/mvmt/v1/admin/exercises`,
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

    const { nextSession, sessionLogs, progressId } = clientPhases.data;
    setNextSession(nextSession?.[0]);
    const reversedLogs = sessionLogs.reverse();
    setSessionLog(reversedLogs);
    setProgressId(progressId);
    setFetchingWorkouts(false);
  }

  return (
    <TrainerProvider>
      <div className="flex flex-col items-start w-full gap-0 bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
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
            />
          )}
          {selectedTab == "body-mass-composition" && (
            <BodyMassComposition client_id={client_id} />
          )}
        </div>
      </div>
    </TrainerProvider>
  );
};

const Tabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="flex flex-row items-stretch justify-between bg-white rounded-lg w-full border-b-[1px] border-gray-200">
      <Tab
        isSelected={selectedTab === "workout-history"}
        label={"Workout History"}
        onClick={() => {
          setSelectedTab("workout-history");
        }}
        icon={<MdChangeHistory size={20} />}
      />
      <Tab
        isSelected={selectedTab === "workout-plan"}
        label={"Workout Plan"}
        onClick={() => {
          setSelectedTab("workout-plan");
        }}
        icon={<IoDocumentTextOutline size={20} />}
      />
      <Tab
        isSelected={selectedTab === "goals"}
        label={"Goals"}
        onClick={() => {
          setSelectedTab("goals");
        }}
        icon={<TbTargetArrow size={20} />}
      />
      <Tab
        isSelected={selectedTab === "body-mass-composition"}
        label={"Body Mass Composition"}
        onClick={() => {
          setSelectedTab("body-mass-composition");
        }}
        icon={<IoIosBody size={20} />}
      />
    </div>
  );
};

const Tab = ({ label, onClick, isSelected, icon }) => {
  return (
    <div
      className={`hover:cursor-pointer flex-1 flex flex-col lg:flex-row items-center justify-center py-4 px-2 gap-2 ${
        isSelected ? "bg-green-500 text-white" : "bg-white"
      }`}
      onClick={onClick}
    >
      {icon}
      <p className={`${isSelected ? "font-semibold" : ""}`}>{label}</p>
    </div>
  );
};

export default ClientDetails;
