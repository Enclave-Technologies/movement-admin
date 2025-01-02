import React from "react";
import { FaEdit, FaCopy, FaPlus, FaTrash } from "react-icons/fa";
import TooltipButton from "../pure-components/TooltipButton";

const SessionActions = ({
  phaseId,
  session,
  setIsEditingTitle,
  handleDeleteSession,
  handleCopySession,
  handleAddExercise,
}) => {
  return (
    <>
      <TooltipButton
        tooltip="Rename Session"
        className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-green-500"
        onClick={() => {
          setIsEditingTitle(true);
        }}
      >
        <FaEdit />
      </TooltipButton>
      <TooltipButton
        tooltip="Delete Session"
        className="ml-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring focus:ring-red-500"
        onClick={handleDeleteSession}
      >
        <FaTrash />
      </TooltipButton>
      <TooltipButton
        tooltip="Duplicate Session"
        className="ml-2 text-green-500 hover:text-green-900 focus:outline-none focus:ring focus:ring-green-500"
        onClick={() => handleCopySession(session)}
      >
        <FaCopy />
      </TooltipButton>
      <TooltipButton
        tooltip="Add Exercise"
        className="ml-2 text-green-500 hover:text-green-900 focus:outline-none focus:ring focus:ring-green-500"
        onClick={() => {
          handleAddExercise(phaseId, session.sessionId);
        }}
      >
        <FaPlus />
        {/* <span className="hidden lg:flex">Copy</span> */}
      </TooltipButton>
    </>
  );
};

export default SessionActions;
