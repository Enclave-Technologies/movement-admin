"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    fetchUserDetails,
    register,
    registerClient,
} from "@/server_functions/auth";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from "react-accessible-accordion";
import { useFormState } from "react-dom";
import Toast from "@/components/Toast";
import Spinner from "@/components/Spinner";
import RegisterForm from "@/components/RegisterForm";
import AddClientForm from "@/components/AddClientForm";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AdminPanel = () => {
    const [state, action] = useFormState(register, undefined);
    const [clientState, clientAction] = useFormState(registerClient, undefined);
    const [pageLoading, setPageLoading] = useState(true);
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [allTrainers, setAllTrainers] = useState([]);
    const ref = useRef<HTMLFormElement>(null);
    const refClientForm = useRef<HTMLFormElement>(null);
    console.log(state);

    useEffect(() => {
        async function loadData() {
            try {
                setPageLoading(true);
                const details = await fetchUserDetails();
                setTrainerDetails(details);

                const allTrainers = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/admin/trainerIds`,
                    {
                        withCredentials: true, // Include cookies in the request
                    }
                );

                setAllTrainers(allTrainers.data);
            } catch (error) {
                console.log(error);
            } finally {
                setPageLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        if (state?.success) {
            ref.current?.reset();
            setToastMessage(state.message || "User registered successfully!");
            setToastType("success");
            setShowToast(true);
        } else if (state?.errors) {
            setToastMessage(Object.values(state.errors).flat().join(", "));
            setToastType("error");
            setShowToast(true);
        }
    }, [state]);
    useEffect(() => {
        if (clientState?.success) {
            refClientForm.current?.reset();
            setToastMessage(
                clientState.message || "User registered successfully!"
            );
            setToastType("success");
            setShowToast(true);
        } else if (clientState?.errors) {
            setToastMessage(
                Object.values(clientState.errors).flat().join(", ")
            );
            setToastType("error");
            setShowToast(true);
        }
    }, [clientState]);

    const handleToastClose = () => {
        setShowToast(false);
    };

    if (pageLoading) {
        return <Spinner />;
    }

    return (
        <div className="flex justify-center items-center w-full">
            <Accordion
                className="w-full"
                allowZeroExpanded
                preExpanded={["client"]}
            >
                {trainerDetails?.team.name === "Admins" && (
                    <AccordionItem uuid="admin" className="mt-1">
                        <AccordionItemHeading>
                            <AccordionItemButton className="bg-green-500 flex py-4 px-2 text-white hover:bg-green-900 transition-colors duration-300">
                                Register a Trainer / Admin
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
                                <RegisterForm
                                    action={action}
                                    ref={ref}
                                    state={state}
                                />
                                {showToast && (
                                    <Toast
                                        message={toastMessage}
                                        onClose={handleToastClose}
                                        type={toastType}
                                    />
                                )}
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                )}
                <AccordionItem uuid="client" className="mt-1">
                    <AccordionItemHeading>
                        <AccordionItemButton
                            className="bg-green-500 flex py-4 px-2
                         text-white hover:bg-green-900 transition-colors rounded
                         duration-300"
                        >
                            Add Client
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
                            <AddClientForm
                                action={clientAction}
                                state={clientState}
                                allTrainers={allTrainers}
                                ref={refClientForm}
                            />
                        </div>
                    </AccordionItemPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default AdminPanel;
