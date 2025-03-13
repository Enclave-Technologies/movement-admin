"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import axios from "axios";
import { API_BASE_URL, BMC_COLUMNS } from "@/configs/constants";
import BMITable from "@/components/pure-components/BMITable";
import { ID } from "appwrite";
import Toast from "../Toast";
import LoadingSpinner from "../LoadingSpinner";

// Follow this calculation
// BF% = (bc*100/ak) + bd
// MM = (weight - (weight*bf%)/100)

// bc=( 1 + (0.195 * ap) - (0.000240 * ap * ap)) * 0.01
// ap = ( pec + subscap + midax + supra + umbil + ((triceps + calf + bb) * ai) )
// bb = (max(quad, ham) + quad)/2
// ai = max(pow(ideal/current, 2), 1)
// ak=(1/(1 + aj))
// aj = ((160 - height)/400)
// bd=((age - 18)*0.8*bc*bc) + 0

const calculateBMI = (weight: number, height: number) => {
    if (height > 0) {
        const heightM = height / 100; // Convert cm to meters
        return Number((weight / (heightM * heightM)).toFixed(2));
    }
    return 0; // Return 0 if height is 0 to avoid division by zero
};

const calculateBodyFat = (
    PEC: number,
    TRICEPS: number,
    SUBSCAP: number,
    MIDAX: number,
    SUPRA: number,
    UBMIL: number,
    CALF: number,
    QUAD: number,
    HAM: number,
    idealWeight: number,
    height: number,
    weight: number,
    age: number
) => {
    try {
        const AI = Math.max(Math.pow(idealWeight / weight, 2), 1);
        const BB = (Math.max(QUAD, HAM) + QUAD) / 2;
        const AJ = (160 - height) / 400;
        const AP =
            PEC + SUBSCAP + MIDAX + SUPRA + UBMIL + (TRICEPS + CALF + BB) * AI;
        const BC = (1 + 0.195 * AP - 0.00024 * AP * AP) * 0.01;
        const BD = (age - 18) * 0.8 * BC * BC + 0;
        const AK = 1 / (1 + AJ);

        return Number(((BC * 100) / AK + BD).toFixed(2));

        // if (!bmi || !gender) return 0;
        // // Deurenberg formula with gender
        // const bodyFat = 1.2 * bmi - 10.8 * gender - 5.4;
        // return isNaN(bodyFat) ? 0 : Number(bodyFat.toFixed(2));
    } catch (error) {
        return 0;
    }
};

const calculateMuscleMass = (
    weight: number,
    bodyFat: number,
    gender: number
) => {
    try {
        if (!weight || !bodyFat) return 0;

        const leanBodyMass = weight - weight * (bodyFat / 100);
        const musclePercentage = gender === 1 ? 0.52 : 0.45; // ~52% for men, 45% for women

        const muscleMass = leanBodyMass * musclePercentage;
        return isNaN(muscleMass) ? 0 : Number(muscleMass.toFixed(2));
    } catch (error) {
        return 0;
    }
};

const calculateExactAge = (dob) => {
    try {
        const today = new Date();
        const birthDate = new Date(dob);

        if (isNaN(birthDate.getTime())) {
            return 18;
        }

        // Calculate the difference in milliseconds
        const ageInMilliseconds = today.getTime() - birthDate.getTime();

        // Convert milliseconds to years, considering leap years by using 365.25 days per year
        const age = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

        return age;
    } catch (error) {
        return 18;
    }
};

const BodyMassComposition = ({
    client_id,
    setToastMessage,
    setToastType,
    setShowToast,
}) => {
    const { userData } = useUser();
    const [bmiRecords, setBmiRecords] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [currentAge, setCurrentAge] = useState(18);
    const [idealWeight, setIdealWeight] = useState(0);
    const [editedData, setEditedData] = useState<BMCRecord | null>(null);

    const handleToastClose = () => {
        setShowToast(false);
    };

    useEffect(() => {
        async function fetchData() {
            if (userData.dob) {
                setCurrentAge(calculateExactAge(userData.dob));
            }

            setIdealWeight(userData.idealWeight);

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/client/bmc?client_id=${client_id}`,
                    { withCredentials: true }
                );

                const recordsWithCalculations = response.data.map((record) => {
                    // const bmi = calculateBMI(record.WEIGHT, record.HEIGHT);
                    // const gender = userData.gender === "m" ? 1 : 0;
                    return {
                        ...record,
                        // BMI: bmi,
                        // BF: calculateBodyFat(bmi, gender),
                        // MM: calculateMuscleMass(
                        //     record.WEIGHT,
                        //     calculateBodyFat(bmi, gender),
                        //     gender
                        // ),
                    };
                });

                // console.log(recordsWithCalculations);

                setBmiRecords(recordsWithCalculations);
            } catch (error) {
                console.error(error);
            }

            setPageLoading(false);
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            HAM: 0,
            BMI: 0,
            BF: 0,
            MM: 0,
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

        // Calculate BMI if height or weight changes
        if (field === "HEIGHT" || field === "WEIGHT") {
            newEditedData.BMI = calculateBMI(
                newEditedData.WEIGHT,
                newEditedData.HEIGHT
            );
        }
        if (
            field === "HEIGHT" ||
            field === "WEIGHT" ||
            field === "PEC" ||
            field === "TRICEPS" ||
            field === "SUBSCAP" ||
            field === "MIDAX" ||
            field === "SUPRA" ||
            field === "UBMIL" ||
            field === "CALF" ||
            field === "QUAD" ||
            field === "HAM"
        ) {
            newEditedData.BF = calculateBodyFat(
                newEditedData.PEC || 0,
                newEditedData.TRICEPS || 0,
                newEditedData.SUBSCAP || 0,
                newEditedData.MIDAX || 0,
                newEditedData.SUPRA || 0,
                newEditedData.UBMIL || 0,
                newEditedData.CALF || 0,
                newEditedData.QUAD || 0,
                newEditedData.HAM || 0,
                idealWeight || 50,
                newEditedData.HEIGHT,
                newEditedData.WEIGHT,
                currentAge
            );

            newEditedData.MM = calculateMuscleMass(
                newEditedData.WEIGHT,
                newEditedData.BF,
                userData.gender === "m" ? 1 : 0
            );
        }

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
