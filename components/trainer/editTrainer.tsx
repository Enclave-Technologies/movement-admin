"use client";
import React, { useEffect, useState } from "react";
import RightModal from "../pure-components/RightModal";
import EditTrainerForm from "../forms/edit-trainer-form";
import { Button } from "../ui/button";
import { MdEdit } from "react-icons/md";

const EditTrainer = ({ trainerDetails }) => {
    const [editRow, setEditRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        setEditRow(trainerDetails);
    }, []);

    const handleTrainerEditClicked = (rowData: CoachTemplate) => {
        setEditRow(rowData);
        // editRowRef.current = rowData;
        setShowEditModal(true);
    };
    const rightEditModal = () => {
        return (
            <RightModal
                formTitle="Edit Trainer / Admin"
                isVisible={showEditModal}
                hideModal={() => {
                    setShowEditModal(false);
                    setEditRow(null);
                }}
            >
                <EditTrainerForm
                    fetchData={() => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }}
                    clientData={editRow}
                    // rowData={editRowRef.current}
                />
            </RightModal>
        );
    };

    return (
        <div>
            <Button
                className="text-white"
                onClick={() => {
                    handleTrainerEditClicked(trainerDetails);
                }}
            >
                <MdEdit /> Edit
            </Button>
            {rightEditModal()}
        </div>
    );
};

export default EditTrainer;
