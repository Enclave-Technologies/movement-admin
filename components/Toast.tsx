import { useEffect } from "react";

const Toast = ({ message, onClose, type = "success" }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Auto-close after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);
    const toastStyles = {
        success: "bg-green-500",
        error: "bg-red-500",
    };
    return (
        <div
            className={`fixed bottom-5 right-5 w-72 p-4 ${toastStyles[type]} text-white rounded-lg shadow-lg transition-transform transform translate-y-0 ease-in-out duration-300`}
        >
            <div className="flex items-center">
                <svg
                    className="mr-2 w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    {type === "success" ? (
                        <path d="M10 18l-6 2 2-6-6-4.5h7L10 0l1 6h7L8 10l6 4.5-2 6-6-2z" />
                    ) : (
                        <path d="M10 10l-1.293-1.293-1.414 1.414L8.414 10l-1.293 1.293 1.414 1.414L10 10zm-4.707 1.414L10 18l6-6-6-6-6 6z" />
                    )}
                </svg>
                <span>{message}</span>
                <button className="ml-auto text-xl" onClick={onClose}>
                    ✖
                </button>
            </div>
        </div>
    );
};

export default Toast;
