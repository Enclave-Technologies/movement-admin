import { defaultProfileURL } from "@/configs/constants";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Select, { components, OptionProps } from "react-select";
import SignupButton from "../ResponsiveButton";
import { useFormState } from "react-dom";
import { registerClient } from "@/server_functions/auth";
import { useStore } from "@/store/store";

const Option = (props: OptionProps<any, false>) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className="flex items-center">
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
            <span className="text-gray-500 text-sm">{data.jobTitle}</span>
          )}
        </div>
      </div>
    </components.Option>
  );
};

const AddUserForm = () => {
  const { trainers } = useStore();
  const [clientState, clientAction] = useFormState(registerClient, undefined);
  const refWorkoutForm = useRef<HTMLFormElement>(null);

  return (
    <form className="space-y-4" action={clientAction} ref={refWorkoutForm}>
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
          getOptionValue={(option) => option.id}
          components={{ Option }}
          className="mt-1 block w-full"
          classNamePrefix="react-select"
        />
      </div>
      <SignupButton label="Submit" />
    </form>
  );
};

export default AddUserForm;
