import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const SecureInput = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-row gap-2 px-2 w-full rounded-md border-black border overflow-hidden shadow-sm focus:outline-none items-center">
      <input
        type={showPassword ? "text" : "password"}
        value={props.value}
        {...props}
        className={`${props.className} outline-none`}
      />
      <button
        type="button"
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
      </button>
    </div>
  );
};

export default SecureInput;
