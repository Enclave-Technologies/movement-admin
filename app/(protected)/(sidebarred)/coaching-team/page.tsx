"use client";

import Searchbar from "@/components/pure-components/Searchbar";
import TrainerTable from "@/components/TrainerTable";
import { API_BASE_URL } from "@/configs/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CoachingTeam = () => {
  const [allTrainers, setAllTrainers] = useState([]);
  const [search, setSearch] = useState("");

  async function loadData() {
    const allTrainers = await axios.get(
      `${API_BASE_URL}/mvmt/v1/admin/trainerIds`,
      {
        withCredentials: true, // Include cookies in the request
      }
    );
    setAllTrainers(allTrainers.data);
  }

  useEffect(() => {
    loadData();
  }, []);
  return (
    <main className="flex flex-col bg-gray-100 text-black">
      <div className="w-full flex flex-col gap-4">
        <Searchbar search={search} setSearch={setSearch} />
        <h1 className="text-xl font-bold text-black ml-2 leading-tight">
          Coaching Team
        </h1>
        <TrainerTable trainers={allTrainers} />
      </div>
    </main>
  );
};

export default CoachingTeam;
