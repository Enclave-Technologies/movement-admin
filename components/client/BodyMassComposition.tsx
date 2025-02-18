"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import axios from "axios";
import { API_BASE_URL, BMC_COLUMNS } from "@/configs/constants";
import BMITable from "@/components/pure-components/BMITable";
import { ID } from "appwrite";
import Toast from "../Toast";
import LoadingSpinner from "../LoadingSpinner";

const calculateBMI = (weight: number, height: number) => {
    if (height > 0) {
        return (weight / (height * 0.02)).toFixed(2); // Calculate BMI
    }
    return 0; // Return 0 if height is 0 to avoid division by zero
};

const BodyMassComposition = ({ client_id }) => {
    const { userData } = useUser(); // Access the user data from Context
    const [bmiRecords, setBmiRecords] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [pageLoading, setPageLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleToastClose = () => {
        setShowToast(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/client/bmc?client_id=${client_id}`,
                    { withCredentials: true }
                );

                const recordsWithBMI = response.data.map((record) => ({
                    ...record,
                    BMI: calculateBMI(record.WEIGHT, record.HEIGHT), // Add BMI field
                }));

                setBmiRecords(recordsWithBMI);
            } catch (error) {
                console.error(error);
            }

            setPageLoading(false);
        }

        fetchData();
    }, []);

    function addNewEmptyRecord() {
        setBmiRecords([
            {
                $id: ID.unique(),
                // users: params.id,
                DATE: new Date().toISOString().slice(0, 10),
                HEIGHT: 0,
                WEIGHT: 0,
                CHIN: 0,
                CHEEK: 0,
                PEC: 0,
                BICEPS: 0,
                TRICEPS: 0,
                SUBSCAP: 0,
                MIDAX: 0,
                SUPRA: 0,
                "UPPER-THIGH": 0,
                UBMIL: 0,
                KNEE: 0,
                CALF: 0,
                QUAD: 0,
                BMI: 0,
            },
            ...bmiRecords,
        ]);
        // bmiRecords.push({});
    }

    async function handleDeleteBmc(bmcId) {
        const toBeDeletedRecord = bmiRecords.filter(
            (record) => record.$id !== bmcId
        );
        try {
            setBmiRecords((prevRecords) =>
                prevRecords.filter((record) => record.$id !== bmcId)
            );
            const response = await axios.delete(
                `${API_BASE_URL}/mvmt/v1/client/bmc/${bmcId}`,
                { withCredentials: true }
            );
            if (response.status === 200) {
                setToastMessage("Deleted record successfully!");
                setToastType("success");
                setShowToast(true);
            } else {
                setToastMessage("Could not delete record!");
                setToastType("error");
                setShowToast(true);
                setBmiRecords([...bmiRecords, toBeDeletedRecord]);
            }
        } catch (error) {
            console.error("Error deleting BMC record:", error);
            setToastMessage("Could not delete record!");
            setToastType("error");
            setShowToast(true);
            setBmiRecords([...bmiRecords, toBeDeletedRecord]);
        }
    }

    async function addBmcToDB(bmcData) {
        try {
            setButtonLoading(true);
            await axios.post(
                `${API_BASE_URL}/mvmt/v1/client/bmc/${client_id}`,
                { bmiRecord: bmcData },
                { withCredentials: true }
            );
        } catch (error) {
            console.error(error);
        }
        setButtonLoading(false);
    }

    return (
        <div className="w-full">
            <div className="w-full flex flex-row items-center justify-between mb-4">
                <button
                    onClick={() => {
                        addNewEmptyRecord();
                    }}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                >
                    + Add New Record
                </button>
            </div>
            {pageLoading ? (
                <LoadingSpinner />
            ) : (
                <BMITable
                    setData={setBmiRecords}
                    data={bmiRecords}
                    emptyText="No BMI Records found"
                    headerColumns={BMC_COLUMNS}
                    handleSave={addBmcToDB}
                    handleDelete={handleDeleteBmc}
                    computeBMI={calculateBMI}
                    buttonLoading={buttonLoading}
                />
            )}

            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={handleToastClose}
                    type={toastType}
                />
            )}
        </div>
    );
};

export default BodyMassComposition;
