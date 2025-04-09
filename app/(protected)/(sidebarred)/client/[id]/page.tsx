"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/context/ClientContext";
import { defaultProfileURL } from "@/configs/constants";
import axios from "axios";
import ClientDetails from "@/components/client/ClientDetails";
import { MdEdit } from "react-icons/md";
import RightModal from "@/components/pure-components/RightModal";
import EditUserForm from "@/components/forms/edit-user-form";
import { useTrainer } from "@/context/TrainerContext";

const Page = ({ params }: { params: { id: string } }) => {
  const { userData, userLoading, userError, reloadData } = useUser(); // Use the context to set user data
  const { trainerData } = useTrainer();
  const [userDataState, setUserDataState] = useState(userData);
  const [showRightModal, setShowRightModal] = useState(false);

  // Check if current user is a coach or admin
  const isCoachOrAdmin =
    trainerData?.jobTitle === "Coach" || trainerData?.team?.includes("Admins");

  useEffect(() => {
    setUserDataState(userData);
  }, [userData]);

  const rightModal = () => {
    return (
      <RightModal
        formTitle="Add User"
        isVisible={showRightModal}
        hideModal={() => {
          setShowRightModal(false);
          setUserDataState(null);
        }}
      >
        <EditUserForm fetchData={reloadData} clientData={userDataState} />
      </RightModal>
    );
  };

  return (
    <div className="flex flex-col items-center justify-between text-black w-full h-full">
      <div className="text-center flex flex-col gap-8 w-full h-full">
        {userLoading ? (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col sm:flex-row gap-12 items-center sm:items-start">
              <div className="relative">
                <div className="rounded-full aspect-square w-52 sm:w-40 bg-gray-300 animate-pulse"></div>
              </div>
              <div className="flex flex-col items-center sm:items-start space-y-1">
                <div className="h-10 w-48 bg-gray-300 animate-pulse"></div>
                <div className="h-6 w-64 bg-gray-300 animate-pulse"></div>
                <div className="h-6 w-64 bg-gray-300 animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : userError ? (
          <p>Error: {userError.message}</p>
        ) : (
          <div className="flex items-start justify-between ">
            <div className="flex flex-col gap-4 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-4 items-start sm:items-start">
                <div className="relative">
                  <Image
                    src={
                      userData.imageUrl && userData.imageUrl.trim() !== ""
                        ? userData.imageUrl
                        : defaultProfileURL
                    }
                    height={72}
                    width={72}
                    alt={`${userData?.name} image`}
                    className="rounded-full aspect-square 
                                        object-cover border-2 border-gray-200
                                        "
                  />
                </div>
                <div className="flex flex-col items-start">
                  <h2 className="text-lg md:text-2xl lg:text-xl font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                    {userData?.name} (
                    {userData?.gender ? userData.gender.toUpperCase() : "N/A"})
                  </h2>
                  <p className="text-base text-gray-600">
                    {userData?.email || "-"}
                  </p>
                  <p className="text-base text-gray-600">
                    {userData?.phone || "-"}
                  </p>
                  {/* <p className="text-base text-gray-600"></p> */}
                  <p className="text-sm text-gray-500">
                    <span className="capitalize">Coach:</span>{" "}
                    {userData?.trainer_name
                      ? userData?.trainer_name
                      : "Unassigned"}
                  </p>

                  {isCoachOrAdmin &&
                    userData?.coachNotes &&
                    userData.coachNotes.trim() !== "" && (
                      <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md max-w-xl">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1 text-left">
                          Coach Notes:
                        </h3>
                        <p className="text-sm text-gray-600 text-left">
                          {userData.coachNotes}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <button
              className="bg-primary px-4 py-2 rounded-md text-sm
                            transition-all duration-200 ease-in-out items-center justify-center capitalize gap-2
                            focus:outline-none focus:ring-2 focus:ring-offset-2 text-white flex"
              onClick={() => {
                setUserDataState(userData);
                setShowRightModal(true);
              }}
            >
              <MdEdit /> Edit
            </button>
          </div>
        )}
        <ClientDetails client_id={params.id} />
      </div>
      {rightModal()}
    </div>
  );
};

export default Page;
