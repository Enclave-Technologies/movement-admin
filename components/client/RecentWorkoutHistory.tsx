import { API_BASE_URL } from "@/configs/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RecentWorkoutHistory = ({ client_id }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const [nextSession, setNextSession] = useState(null);
  const [progressId, setProgressId] = useState("");
  const [sessionLog, setSessionLog] = useState([]);
  const [workoutPressed, setWorkoutPressed] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setPageLoading(true);
        const clientPhases = await axios.get(
          `${API_BASE_URL}/mvmt/v1/client/tracked-workouts?client_id=${client_id}`,
          { withCredentials: true }
        );

        const { nextSession, sessionLogs, progressId } = clientPhases.data;
        setNextSession(nextSession[0]);
        setSessionLog(sessionLogs);
        setProgressId(progressId);
      } catch (e) {

      } finally {
        setPageLoading(false);
      }
    }
    loadData();
  }, []);

  if (!sessionLog || sessionLog.length === 0 || !nextSession) {
    return null;
  }



  return (
    <div className="flex flex-col items-start gap-4 rounded-lg bg-white shadow-md p-4">
      <div className="flex flex-row items-center justify-center gap-4">
        <h3 className="text-lg font-bold text-gray-800">Recent Workouts</h3>
        <Link
          href="/tracked-workouts"
          className="text-sm hover:underline text-gray-500"
        >
          View all &gt;
        </Link>
      </div>
      <div className=" flex flex-row justify-between w-full rounded-md overflow-hidden border-[1px] border-green-500">
        {sessionLog
          ?.slice(sessionLog.length - 3, sessionLog.length)
          .map((session, index) => (
            <div
              key={index}
              className="border-r-[1px] border-green-500 flex-1 p-4 flex flex-col items-center justify-start"
            >
              <div>
                <p className="font-bold">
                  {new Date(session.endDate).toDateString()}
                </p>
                <p>
                  {session.sessions.phases.phaseName} -{" "}
                  {session.sessions.sessionName}
                </p>
              </div>
            </div>
          ))}
        <div className="p-4 flex flex-col items-center justify-between border-green-500 flex-1 gap-2 bg-green-100">
          <div>
            <p className="font-bold">Upcoming Session</p>
            <p>
              {nextSession.phases.phaseName} - {nextSession.sessionName}
            </p>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentWorkoutHistory;
