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
        return Number((weight / (height * 0.02)).toFixed(2)); // Calculate BMI
    }
    return 0; // Return 0 if height is 0 to avoid division by zero
};

const BodyMassComposition = ({
    client_id,
    setToastMessage,
    setToastType,
    setShowToast,
}) => {
    const { userData } = useUser(); // Access the user data from Context
    const [bmiRecords, setBmiRecords] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState<BMCRecord | null>(null);

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
        const newId = ID.unique();
        const newRecord = {
            $id: newId,
            // users: params.id, // Uncomment this if you want to assign user id
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
        };

        // Append the new record to the existing bmiRecords
        setBmiRecords((prevRecords) => [newRecord, ...prevRecords]);
        addBmcToDB(newRecord);
        setEditedData(newRecord);
        setEditingRowId(newId);
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

            setToastMessage("Deleted record successfully!");
            setToastType("success");
            setShowToast(true);
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

            setToastMessage("Body Mass Composition added successfully.");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error(error);
        }
        setButtonLoading(false);
    }

    // When setting editedData for DATE field, format it properly
    const formatDateToInput = (date) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    };

    const handleEditRow = (rowId) => {
        const row = bmiRecords.find((row) => row.$id === rowId);
        const formattedRow = { ...row, DATE: formatDateToInput(row.DATE) }; // Format DATE
        setEditingRowId(rowId);
        setEditedData(formattedRow);
    };

    const handleUpdateRow = async (rowId) => {
        // Update the data array with the edited data
        // setSaving(true);
        const updatedData = bmiRecords.map((row) =>
            row.$id === rowId ? editedData : row
        );
        await addBmcToDB(editedData);
        setBmiRecords(updatedData);
        setEditingRowId(null);
        setEditedData(null);
        // setSaving(false);
    };

    const handleInputChange = (event, field) => {
        const value = event.target.value;

        // Remove leading zeros for numeric fields
        const formattedValue =
            field !== "DATE" ? value.replace(/^0+(?=\d)/, "") : value;

        // Convert to number and fix to 2 decimal places if it's numeric
        const isNumeric = !isNaN(formattedValue) && formattedValue !== "";
        const newValue = isNumeric
            ? parseFloat(formattedValue)
            : formattedValue;

        // Create a new edited data state based on the current one
        const newEditedData = {
            ...editedData,
            [field]: newValue, // Update the specific field
        };

        // Check if we need to calculate BMI
        if (field === "HEIGHT" || field === "WEIGHT") {
            newEditedData.BMI = calculateBMI(
                newEditedData.WEIGHT,
                newEditedData.HEIGHT
            ); // Calculate BMI
        }

        // Set the new state with all updates
        setEditedData(newEditedData);
    };

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
                    data={bmiRecords}
                    emptyText="No BMI Records found"
                    headerColumns={BMC_COLUMNS}
                    handleDelete={handleDeleteBmc}
                    buttonLoading={buttonLoading}
                    editedData={editedData}
                    editingRowId={editingRowId}
                    handleEditRow={handleEditRow}
                    handleInputChange={handleInputChange}
                    handleUpdateRow={handleUpdateRow}
                />
            )}
        </div>
    );
};

export default BodyMassComposition;
