"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import BreadcrumbLoading from "@/components/BreadcrumbLoading";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import axios from "axios";
import NextSessionInfo from "@/components/NextSessionInfo";
import SessionLogTable from "@/components/SessionLogTable";
import { API_BASE_URL } from "@/configs/constants";
const sessions = [
  {
    id: 1,
    date: "Sep 2, 2024",
    session: "Phase 1",
    tut: "422",
    exercises: "14",
  },
  {
    id: 2,
    date: "Aug 31, 2024",
    session: "Phase 1",
    tut: "422",
    exercises: "16",
  },
  {
    id: 3,
    date: "Aug 30, 2024",
    session: "Phase 1",
    tut: "422",
    exercises: "12",
  },
  {
    id: 4,
    date: "Aug 29, 2024",
    session: "Phase 1",
    tut: "422",
    exercises: "16",
  },
  {
    id: 5,
    date: "Aug 27, 2024",
    session: "Phase 1",
    tut: "422",
    exercises: "12",
  },
];

const Page = ({ params }: { params: { id: string } }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const [nextSession, setNextSession] = useState(null);
  const [progressId, setProgressId] = useState("");
  const [sessionLog, setSessionLog] = useState([]);
  const [workoutPressed, setWorkoutPressed] = useState(false);
  const page_title = ["Tracked Workouts"];
  const { userData } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        setPageLoading(true);
        const clientPhases = await axios.get(
          `${API_BASE_URL}/mvmt/v1/client/tracked-workouts?client_id=${params.id}`,
          { withCredentials: true }
        );

        const { nextSession, sessionLogs, progressId } = clientPhases.data;
        setNextSession(nextSession?.[0]);
        setSessionLog(sessionLogs);
        setProgressId(progressId);
      } catch (e) {
        console.log(e);
      } finally {
        setPageLoading(false);
      }
    }
    loadData();
  }, []);

  const handleViewSession = (session: any) => {
    console.log(
      `Viewing session on ${session.date}:\n\nTut:\n${session.tut}\n\nExercises:\n${session.exercises}`
    );
  };

  const handleStartWorkout = async () => {
    // e.preventDefault();
    try {
      // setPageLoading(true);
      setWorkoutPressed(true);
      console.log("Preparing to start workout...");
      const response = await axios.post(
        `${API_BASE_URL}/mvmt/v1/client/start-workouts`,
        {
          progress_id: progressId,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      // console.log("Client ID:", params.id);
      // console.log("Phase ID:", nextSession?.phases.$id);
      // console.log("Session ID:", nextSession?.$id);
      router.push(
        `/record-workout?clientId=${params.id}&phaseId=${nextSession?.phases.$id}&sessionId=${nextSession?.$id}`
      );
    } catch (e) {
      console.error("Failed to start workout:", e);
    } finally {
      setWorkoutPressed(false);
      // setPageLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="ml-12">
        <BreadcrumbLoading />
        <Spinner />
      </div>
    );
  }
  return (
    <div>
      <div className="ml-12">
        <Breadcrumb
          homeImage={userData?.imageUrl}
          homeTitle={userData?.name}
          customTexts={page_title}
        />
      </div>
      <div className="mt-4">
        {/* <br /> */}
        {/* {JSON.stringify(nextSession, null, 2)} */}
        <h5 className="font-bold">Next Workout</h5>
      </div>
      <br />

      <NextSessionInfo
        sessionInfo={nextSession}
        workoutPressed={workoutPressed}
        handleStartWorkout={handleStartWorkout}
      />
      <section>
        <h3 className="font-bold mb-2 uppercase">Workout History</h3>
        <SessionLogTable
          dataLoading={pageLoading}
          handleViewSession={handleViewSession}
          sessions={sessionLog}
        />
      </section>
    </div>
  );
};

export default Page;
