"use client";
import { defaultProfileURL } from "@/configs/constants";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Select, { components, OptionProps } from "react-select";
import SubmitButton from "../ResponsiveButton";
import { useFormState } from "react-dom";
import { registerClient } from "@/server_functions/auth";
import Toast from "../Toast";
import { useGlobalContext } from "@/context/GlobalContextProvider";

const Option = (props: OptionProps<any, false>) => {
  const { data, isSelected, isFocused } = props;
  return (
    <components.Option {...props}>
      <div
        className={`flex items-center px-3 py-2 ${
          isSelected
            ? "bg-green-500 text-white"
            : isFocused
            ? "bg-gray-100"
            : "hover:bg-gray-100"
        }`}
      >
        <Image
          src={data.imageUrl || defaultProfileURL}
          alt={data.name}
          width={30}
          height={30}
          className="w-8 h-8 rounded-full mr-2"
        />

        <div className="flex flex-col">
          <span className="font-semibold">{data.name}</span>
          {data.jobTitle && (
            <span
              className={`text-sm ${
                isSelected ? "text-gray-100" : "text-gray-500"
              }`}
            >
              {data.jobTitle}
            </span>
          )}
        </div>
      </div>
    </components.Option>
  );
};

const AddUserForm = ({
  fetchData,
  trainerId,
}: {
  fetchData: () => void;
  trainerId?: string;
}) => {
  const { trainers } = useGlobalContext();
  const [clientState, clientAction] = useFormState(registerClient, undefined);
  const ref = useRef<HTMLFormElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    if (clientState?.success) {
      fetchData();
      // ref.current?.reset();
      setToastMessage(
        clientState.message || "Trainer registered successfully!"
      );
      setToastType("success");
      setShowToast(true);
    } else if (clientState?.errors) {
      setToastMessage(Object.values(clientState.errors).flat().join(", "));
      setToastType("error");
      setShowToast(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientState]);

  const handleToastClose = () => {
    setShowToast(false);
  };

  return (
    <div>
      <form className="space-y-4" action={clientAction} ref={ref}>
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {clientState?.errors?.firstName && (
            <p className="text-red-500 text-xs italic">
              {clientState.errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {clientState?.errors?.lastName && (
            <p className="text-red-500 text-xs italic">
              {clientState.errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {clientState?.errors?.phone && (
            <p className="text-red-500 text-xs italic">
              {clientState.errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {clientState?.errors?.email && (
            <p className="text-red-500 text-xs italic">
              {clientState.errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="m">M</option>
            <option value="f">F</option>
          </select>
          {clientState?.errors?.gender && (
            <p className="text-red-500 text-xs italic">
              {clientState.errors.gender}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {clientState?.errors?.dateOfBirth && (
            <p className="text-red-500 text-xs italic">
              {clientState.errors.dateOfBirth}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="trainerId"
            className="block text-sm font-medium text-gray-700"
          >
            Select Trainer
          </label>

          <Select
            id="trainerId"
            name="trainerId"
            options={trainers}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.uid}
            components={{ Option }}
            className="mt-1 block w-full"
            classNamePrefix="react-select"
            defaultValue={
              trainerId
                ? trainers.find((trainer) => trainer.uid === trainerId)
                : null
            }
            styles={{
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? "#006747" // Selected option background color
                  : state.isFocused
                  ? "#f7f7f7" // Hovered option background color
                  : "white",
                color: state.isSelected
                  ? "white" // Selected option text color
                  : state.isFocused
                  ? "#006747" // Hovered option text color
                  : "black",
              }),
              menu: (provided) => ({
                ...provided,
                borderRadius: "0.5rem", // Change the border radius of the dropdown menu
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Add a box shadow to the dropdown menu
              }),
            }}
          />
        </div>

        <div>
          <label
            htmlFor="idealWeight"
            className="block text-sm font-medium text-gray-700"
          >
            Ideal weight
          </label>
          <input
            type="number"
            id="idealWeight"
            name="idealWeight"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {clientState?.errors?.idealWeight && (
            <p className="text-red-500 text-xs italic">
              {clientState.errors.idealWeight}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="coachNotes"
            className="block text-sm font-medium text-gray-700"
          >
            Coach Notes
          </label>

          <textarea
            id="coachNotes"
            name="coachNotes"
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Add any notes or observations about this client..."
          ></textarea>
          {clientState?.errors?.coachNotes && (
            <p className="text-red-500 text-xs italic">
              {clientState.errors.coachNotes}
            </p>
          )}
        </div>

        <SubmitButton label="Submit" />
      </form>
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

export default AddUserForm;
