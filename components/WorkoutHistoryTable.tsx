import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from "react-accessible-accordion";
import BreadcrumbLoading from "./BreadcrumbLoading";
import { FaChevronRight, FaChevronUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const WorkoutHistoryTable = ({
  sessions,
  handleViewSession,
  dataLoading,
  deleteSession,
  deletingSession,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      // timeZone: "UTC",
    });
  };

  if (dataLoading) {
    return (
      <div className="">
        <BreadcrumbLoading />
      </div>
    );
  }

  if (deletingSession) {
    return (
      <div className="">
        <BreadcrumbLoading />
      </div>
    );
  }

  if (!dataLoading && sessions.length === 0) {
    return (
      <div className="w-full">
        <p className="text-base font-bold text-gray-800">
          No Workout History Found
        </p>
      </div>
    );
  }

  const calculateTotalVolume = (exerciseLog) => {
    let totalVolume = 0;
    exerciseLog.forEach((exercise) => {
      exercise.setLog.forEach((set) => {
        totalVolume += set.repetitions * set.weight;
      });
    });
    return totalVolume;
  };

  const handleDeleteSession = () => {
    setShowDeleteConfirmation(false);
    deleteSession(selectedSessionId);
  };

  return (
    <div className="w-full">
      <Accordion allowZeroExpanded>
        {sessions.map((session) => (
          <AccordionItem
            key={session.$id}
            className="bg-white shadow-md rounded-lg mb-4"
          >
            <AccordionItemHeading>
              <AccordionItemButton className="w-full px-6 py-4 bg-gray-100 rounded-t-lg flex justify-between items-center cursor-pointer hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                <div className="flex items-center w-full">
                  <AccordionItemState>
                    {({ expanded }) =>
                      !expanded ? (
                        <>
                          <FaChevronRight className="text-base" />
                        </>
                      ) : (
                        <>
                          <FaChevronUp className="text-base" />
                        </>
                      )
                    }
                  </AccordionItemState>
                  <div className="flex flex-row justify-between items-center w-full">
                    <h2 className="text-base font-bold text-gray-800 capitalize ml-4">
                      {session.phaseName} - {session.sessionName}
                    </h2>
                    <div className="flex flex-row items-center gap-4">
                      <h2 className="text-base font-bold text-gray-600 ml-4">
                        {new Date(session.startDate).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </h2>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSessionId(session.$id);
                          setShowDeleteConfirmation(true);
                        }}
                      >
                        <MdDelete size={20} color="red" />
                      </button>
                    </div>
                  </div>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800 capitalize text-left">
                    Start Time
                  </h3>
                  <p className="text-gray-600 text-left">
                    {formatDateTime(session.startDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 capitalize text-left">
                    End Time
                  </h3>
                  <p className="text-gray-600 text-left">
                    {formatDateTime(session.endDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 capitalize text-left">
                    Total Volume
                  </h3>
                  <p className="text-gray-600 text-left">
                    {calculateTotalVolume(session.exerciseLog)} kg
                  </p>
                </div>
              </div>
              <ExerciseLog exerciseLog={session.exerciseLog} />
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>

      {showDeleteConfirmation && (
        <DeleteConfirmationDialog
          title="workout history?"
          confirmDelete={handleDeleteSession}
          cancelDelete={() => setShowDeleteConfirmation(false)}
          isLoading={deletingSession}
        />
      )}
    </div>
  );
};

const ExerciseLog = ({ exerciseLog }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  return (
    <div>
      <div className="flex flex-row items-center justify-start gap-2 mb-4">
        {/* <button
          className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-all duration-200"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <>
              <FaChevronRight className="text-lg" />
            </>
          ) : (
            <>
              <FaChevronUp className="text-lg" />
            </>
          )}
        </button> */}
        <h3 className="text-base font-bold text-gray-800 capitalize text-left">
          Exercises
        </h3>
      </div>
      {!isCollapsed && (
        <div className="space-y-4 bg-gray-100 rounded-lg overflow-hidden">
          {exerciseLog.map((exercise, index) => (
            <div
              key={exercise.$id}
              className="bg-gray-100 p-4 capitalize grid grid-cols-2 border-b-[1px] border-b-gray-400"
            >
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold text-gray-800 capitalize text-left">
                  {index + 1}. {exercise.exerciseName}
                </h4>
                <div className="flex flex-col">
                  <p className="text-sm text-left">
                    Total Volume:{" "}
                    {exercise.setLog
                      .map((set) => set.weight * set.repetitions)
                      .reduce((a, b) => a + b, 0)}{" "}
                    kg
                  </p>
                  <p className="text-sm text-left">
                    Notes: {exercise.notes || "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h5 className="text-base font-bold text-gray-800 mb-1 text-left">
                    Set #
                  </h5>
                  {exercise.setLog.map((set, setIndex) => (
                    <p key={set.$id} className="text-gray-600 text-left">
                      {setIndex + 1}
                    </p>
                  ))}
                </div>
                <div>
                  <h5 className="text-base font-bold text-gray-800 mb-1 text-left">
                    Reps
                  </h5>
                  {exercise.setLog.map((set) => (
                    <p key={set.$id} className="text-gray-600 text-left">
                      {set.repetitions}
                    </p>
                  ))}
                </div>
                <div>
                  <h5 className="text-base font-bold text-gray-800 mb-1 text-left">
                    Weight (KG)
                  </h5>
                  {exercise.setLog.map((set) => (
                    <p key={set.$id} className="text-gray-600 text-left">
                      {set.weight}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistoryTable;
