import React from "react";
import { IoIosBody } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdChangeHistory } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { Tab } from "./Tab";

export const Tabs = ({ 
  selectedTab, 
  setSelectedTab, 
  hasUnsavedChanges = false, 
  onTabChangeAttempt = null 
}) => {
  
  const handleTabClick = (tabName) => {
    // If there are unsaved changes and a handler is provided, use it
    if (hasUnsavedChanges && onTabChangeAttempt) {
      onTabChangeAttempt(tabName);
    } else {
      // Otherwise, change tabs directly
      setSelectedTab(tabName);
    }
  };
  
  return (
    <div className="flex flex-row items-stretch justify-between bg-white rounded-lg w-full border-b-[1px] border-gray-200 rounded-t-xl">
      <Tab
        isSelected={selectedTab === "workout-history"}
        label={"Workout History"}
        onClick={() => handleTabClick("workout-history")}
        icon={<MdChangeHistory size={20} />}
      />
      <Tab
        isSelected={selectedTab === "workout-plan"}
        label={"Workout Plan"}
        onClick={() => handleTabClick("workout-plan")}
        icon={<IoDocumentTextOutline size={20} />}
      />
      <Tab
        isSelected={selectedTab === "goals"}
        label={"Goals"}
        onClick={() => handleTabClick("goals")}
        icon={<TbTargetArrow size={20} />}
      />
      <Tab
        isSelected={selectedTab === "body-mass-composition"}
        label={"Body Mass Composition"}
        onClick={() => handleTabClick("body-mass-composition")}
        icon={<IoIosBody size={20} />}
      />
    </div>
  );
};
