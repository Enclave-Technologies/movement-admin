"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const RightModal = ({
    formTitle,
    children,
    isVisible, // New prop to control visibility
    hideModal,
}: {
    formTitle: string;
    children: JSX.Element;
    isVisible: boolean; // New prop type
    hideModal: () => void;
}) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end transition-duration-500 ${
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                className={`h-full min-w-96 w-1/2 bg-white p-8 flex flex-col gap-8 transition-transform duration-500 ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-row items-center justify-between pb-2 border-b-[1px] border-b-gray-400">
                    <h2 className="text-xl font-bold">{formTitle}</h2>
                    <button
                        onClick={() => {
                            hideModal();
                        }}
                    >
                        <IoClose size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
export default RightModal;
