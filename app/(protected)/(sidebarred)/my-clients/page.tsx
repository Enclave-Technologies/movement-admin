"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UsersTable from "@/components/UsersTable";
import Searchbar from "@/components/pure-components/Searchbar";
import AddUserForm from "@/components/forms/add-user-form";
import RightModal from "@/components/pure-components/RightModal";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { LIMIT } from "@/configs/constants";
import Pagination from "@/components/pure-components/Pagination";
import UserSkeleton from "@/components/pageSkeletons/userSkeleton";
import { getCurrentUser } from "@/server_functions/auth";
import { API_BASE_URL } from "@/configs/constants";

export default function AllClients() {
  const [clients, setClients] = useState<Client[]>([]); // State to hold the clients data
  const [lastId, setLastId] = useState<number>(1); // State to hold the last ID of the fetched clients
  const [totalPages, setTotalPages] = useState<number>(1); // State to hold the last ID of the fetched clients
  const [isFetching, setIsFetching] = useState(false); // State to track if a fetch is in progress

  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [showRightModal, setShowRightModal] = useState(false);
  const { countDoc, users, reloadData } = useGlobalContext();

  useEffect(() => {
    const fetchData = async () => {
      if (users) {
        const current_user = await getCurrentUser();
        const myClients = users.filter(
          (user) =>
            user.trainer_id === current_user?.$id &&
            (user.name.toLowerCase().includes(search.toLowerCase()) ||
              user.email?.toLowerCase().includes(search.toLowerCase()) ||
              user.phone?.toLowerCase().includes(search.toLowerCase()))
        );

        setTotalPages(Math.ceil(myClients.length / LIMIT));
        const startIndex = (lastId - 1) * LIMIT;
        const endIndex = startIndex + LIMIT;
        setClients(myClients.slice(startIndex, endIndex));
      }
    };
    fetchData();
  }, [users, lastId, search]);

  const rightModal = () => {
    return (
      <RightModal
        formTitle="Add User"
        isVisible={showRightModal}
        hideModal={() => {
          setShowRightModal(false);
        }}
      >
        <AddUserForm fetchData={reloadData} />
      </RightModal>
    );
  };

  if (users.length === 0)
    return (
      <UserSkeleton
        button_text="Add User"
        pageTitle="My Clients"
        buttons={totalPages}
        active_page={lastId}
      />
    );

  return (
    <main className="flex flex-col bg-transparent text-black">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold text-black ml-2 leading-tight">
            My Clients
          </h1>
          <button
            onClick={() => {
              setShowRightModal(true);
            }}
            className="bg-primary text-white py-2 px-4 rounded-md"
          >
            + Add User
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <UsersTable clients={clients} search={search} />
        </div>

        <Pagination
          totalPages={totalPages}
          pageNo={lastId}
          handlePageChange={(page: number) => {
            setLastId(page);
          }}
        />
        {rightModal()}
      </div>
    </main>
  );
}
