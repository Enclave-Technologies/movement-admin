import React from "react";
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

const SessionLogTable = ({ sessions, handleViewSession, dataLoading }) => {
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

  if (!dataLoading && sessions.length === 0) {
    return (
      <div className="w-full">
        <p className="text-base font-bold text-gray-800">
          No Workout History Found
        </p>
      </div>
    );
  }

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
                    <h2 className="text-base font-bold text-gray-800 uppercase ml-4">
                      {session.phases.phaseName} -{" "}
                      {session.sessions.sessionName}
                    </h2>
                    <h2 className="text-base font-bold text-gray-600 ml-4">
                      {new Date(session.startDate).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h2>
                  </div>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 uppercase">
                    Phase
                  </h3>
                  <p className="text-gray-600  uppercase">
                    {session.phases.phaseName}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800  uppercase">
                    Session
                  </h3>
                  <p className="text-gray-600  uppercase">
                    {session.sessions.sessionName}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800  uppercase">
                    Start Time
                  </h3>
                  <p className="text-gray-600  uppercase">
                    {formatDateTime(session.startDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800  uppercase">
                    End Time
                  </h3>
                  <p className="text-gray-600  uppercase">
                    {formatDateTime(session.endDate)}
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2  uppercase">
                Exercises
              </h3>
              <div className="space-y-4">
                {session.exerciseLog.map((exercise, index) => (
                  <div
                    key={exercise.$id}
                    className="bg-gray-100 rounded-lg p-4  uppercase"
                  >
                    <h4 className="text-lg font-bold text-gray-800 mb-2  uppercase">
                      Exercise {index + 1}:{" "}
                      {exercise.exercises.SpecificDescription}
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h5 className="text-base font-bold text-gray-800 mb-1">
                          Set
                        </h5>
                        {exercise.setLog.map((set, setIndex) => (
                          <p key={set.$id} className="text-gray-600">
                            {setIndex + 1}.
                          </p>
                        ))}
                      </div>
                      <div>
                        <h5 className="text-base font-bold text-gray-800 mb-1">
                          Reps
                        </h5>
                        {exercise.setLog.map((set) => (
                          <p key={set.$id} className="text-gray-600">
                            {set.repetitions}
                          </p>
                        ))}
                      </div>
                      <div>
                        <h5 className="text-base font-bold text-gray-800 mb-1">
                          Weight
                        </h5>
                        {exercise.setLog.map((set) => (
                          <p key={set.$id} className="text-gray-600">
                            {set.weight}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default SessionLogTable;
