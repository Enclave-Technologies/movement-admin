import React from "react";

const FormError = ({ message, className = "" }) => {
    return (
        <div className={`${className} mb-4 text-red-500 text-sm`}>
            {message}
        </div>
    );
};

export default FormError;
