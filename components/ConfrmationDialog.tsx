import React from "react";

const ConfirmationDialog = ({ title, message, button1, button2 }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="bg-white min-w-80 flex flex-col gap-8">
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-lg">{message}</p>
          </div>
          <div className="w-full mt-4 flex flex-row items-center gap-4 justify-end">
            {button1}
            {button2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
