"use client";

import Searchbar from "@/components/pure-components/Searchbar";
import TrainerTable from "@/components/TrainerTable";
import { API_BASE_URL } from "@/configs/constants";
import RightModal from "@/components/pure-components/RightModal";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { LIMIT } from "@/configs/constants";
import Pagination from "@/components/pure-components/Pagination";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserSkeleton from "@/components/pageSkeletons/userSkeleton";
import { fetchUserDetails } from "@/server_functions/auth";
import RegisterTrainerForm from "@/components/forms/RegisterTrainerForm";
import TableActions from "@/components/InfiniteScrollTable/TableActions";

const CoachingTeam = () => {
  const [allTrainers, setAllTrainers] = useState([]);
  const [pageNo, setPageNo] = useState<number>(1); // State to hold the last ID of the fetched clients
  const [totalPages, setTotalPages] = useState<number>(1); // State to hold the last ID of the fetched clients
  const [pageLoading, setPageLoading] = useState(true);
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [showRightModal, setShowRightModal] = useState(false);
  const { countDoc, trainers, reloadData } = useGlobalContext();
  const [tableSearchQuery, setTableSearchQuery] = useState("");

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      const details = await fetchUserDetails();
      setTrainerDetails(details);
    };
    fetchTrainerDetails();
  }, []);

  useEffect(() => {
    if (trainers) {
      const filteredTrainers = trainers.filter(
        (trainer) =>
          trainer.name.toLowerCase().includes(search.toLowerCase()) ||
          trainer.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
          trainer.email?.toLowerCase().includes(search.toLowerCase()) ||
          trainer.phone?.toLowerCase().includes(search.toLowerCase())
      );

      setTotalPages(Math.ceil(filteredTrainers.length / LIMIT));
      const startIndex = (pageNo - 1) * LIMIT;
      const endIndex = startIndex + LIMIT;
      setAllTrainers(filteredTrainers.slice(startIndex, endIndex));
    }
  }, [trainers, pageNo, search]);

  const rightModal = () => {
    return (
      <RightModal
        formTitle="Add Trainer / Admin"
        isVisible={showRightModal}
        hideModal={() => {
          setShowRightModal(false);
        }}
      >
        <div className="w-full">
          <RegisterTrainerForm fetchData={reloadData} />
        </div>
      </RightModal>
    );
  };

  if (trainers.length === 0) {
    return (
      <UserSkeleton
        button_text="Add Trainer"
        pageTitle="Coaching Team"
        buttons={totalPages}
        active_page={pageNo}
        searchLoadingText="Search trainer by name, email, phone or title"
        tableHeaders={["", "Name", "Title", "Email", "Phone"]}
      />
    );
  }

  return (
    <main className="flex flex-col bg-transparent text-black">
      <div className="w-full flex flex-col gap-4">
        {/* <Searchbar
                    search={search}
                    setSearch={setSearch}
                    placeholder="Search trainer by name, email, phone or title"
                /> */}

        <div className="w-full flex flex-row items-center justify-between py-2 border-b-[1px] border-gray-200">
          <h1 className="text-xl font-bold text-black leading-tight">
            Coaching Team
          </h1>
          {trainerDetails?.team.name === "Admins" && (
            <TableActions
              tableSearchQuery={tableSearchQuery}
              setTableSearchQuery={setTableSearchQuery}
              onClickNewButton={() => {
                setShowRightModal(true);
              }}
            />
          )}
        </div>
        {/* <pre>{JSON.stringify(trainerDetails)}</pre> */}
        <div className="w-full overflow-x-auto">
          <TrainerTable search={search} trainers={allTrainers} />
        </div>

        <Pagination
          totalPages={totalPages}
          pageNo={pageNo}
          handlePageChange={(page: number) => {
            setPageNo(page);
          }}
        />
        {rightModal()}
      </div>
    </main>
  );
};

export default CoachingTeam;
