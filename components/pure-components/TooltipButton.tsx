import React, { useState } from "react";

const TooltipButton = ({ tooltip, children, ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="relative">
      <button
        {...props}
        onMouseEnter={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
      >
        {children}
      </button>
      {showTooltip && (
        <div className="absolute bottom-6 left-6 bg-gray-100 px-4 py-2 inline-block rounded-md">
          <p className="capitalize text-sm min-w-12">{tooltip}</p>
        </div>
      )}
    </div>
  );
};

export default TooltipButton;
