"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/ClientContext"; // Import the custom hook
import Breadcrumb from "@/components/Breadcrumb";
import axios from "axios";
import { API_BASE_URL, BMC_COLUMNS } from "@/configs/constants";
import EditableTable from "@/components/pure-components/EditableTable";
import { ID } from "appwrite";

const Page = ({ params }: { params: { id: string } }) => {
    const { userData } = useUser(); // Access the user data from Context
    const page_title = ["BMI Records"];
    const [bmiRecords, setBmiRecords] = useState([]);

    async function handleSaveBmc(bmcRecord) {
        try {
            console.log(JSON.stringify(bmcRecord, null, 2));
            const response = await axios.post(
                `${API_BASE_URL}/mvmt/v1/client/bmc/${params.id}`,
                bmcRecord,
                { withCredentials: true }
            );
            // setBmiRecords([...bmiRecords, response.data]);
        } catch (error) {
            console.error("Error saving BMI record: ", error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/client/bmc?client_id=${params.id}`,
                    { withCredentials: true }
                );
                setBmiRecords(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    function addNewEmptyRecord() {
        console.log(bmiRecords);
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
            },
            ...bmiRecords,
        ]);
        // bmiRecords.push({});
    }

    return (
        <div className="mt-16 w-full">
            <div className="w-full flex flex-row items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black ml-2 leading-tight">
                    Body Mass Composition
                </h1>
                <button
                    onClick={() => {
                        addNewEmptyRecord();
                    }}
                    className="bg-primary text-white py-2 px-4 rounded-md"
                >
                    + Add New Record
                </button>
            </div>
            <EditableTable
                data={bmiRecords}
                handleSaveBmc={handleSaveBmc}
                emptyText="No BMI Records found"
                headerColumns={BMC_COLUMNS}
            />
        </div>
    );
};

export default Page;
