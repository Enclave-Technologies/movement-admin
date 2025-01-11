"use client";
import React, { useState, useMemo } from "react";
import axios from "axios";
import AddUserForm from "@/components/forms/add-user-form";
import RightModal from "@/components/pure-components/RightModal";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";
import { defaultProfileURL, LIMIT } from "@/configs/constants";
import { API_BASE_URL } from "@/configs/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TiSortAlphabetically } from "react-icons/ti";
import { MdOutlineMail, MdOutlinePerson, MdOutlinePhone } from "react-icons/md";
import TableActions from "@/components/InfiniteScrollTable/TableActions";

export default function AllClients() {
  const [modified, setModified] = useState(true);
  const [added, setAdded] = useState(true);
  const [showRightModal, setShowRightModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [tableSearchQuery, setTableSearchQuery] = useState("");

  const router = useRouter();

  // Separate useEffect hook for fetching user details

  const queryClient = new QueryClient();

  const handleRowClick = (client) => {
    // Implement the action you want to execute on double-click
    console.log("Client clicked:", client);
    // For example, you can redirect to the client details page
    // window.location.href = `client/${client.uid}`;
    router.push(`client/${client.uid}`);
  };

  const columns = useMemo<ColumnDef<UserTemplate>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "",
        cell: (info) => (
          <div className="w-10 h-10 flex items-center justify-center">
            <Image
              src={
                info.getValue() && String(info.getValue()).trim() !== ""
                  ? String(info.getValue())
                  : defaultProfileURL
              } // Provide a default placeholder
              width={24}
              height={24}
              alt={`Image of ${info.row.original.name}`}
              className="rounded-full"
            />
          </div>
        ),
        size: 50,
        enableSorting: false,
      },
      {
        icon: <TiSortAlphabetically />,
        header: "Name",
        accessorKey: "name",
        cell: (info) => (
          <div
            className="whitespace-nowrap cursor-pointer text-sm font-semibold underline"
            onClick={() => handleRowClick(info.row.original)}
          >
            {info.getValue() as String}
          </div>
        ),
        size: 200,
      },
      {
        icon: <MdOutlineMail />,
        header: "Email",
        accessorKey: "email",
        size: 250,
      },
      {
        icon: <MdOutlinePhone />,
        header: "Phone",
        accessorKey: "phone",
        size: 150,
      },
      {
        icon: <MdOutlinePerson />,
        header: "Trainer",
        accessorKey: "trainer_name",
        size: 250,
        enableSorting: false,
      },
      // {
      //     header: "Status",
      //     accessorKey: "status",
      // },
    ],
    []
  );

  async function fetchUsers(
    start: number,
    size: number,
    sorting: SortingState
  ) {
    let response: any;
    const pageNo = start / size + 1;
    if (sorting.length) {
      const sort = sorting[0] as ColumnSort;
      const { id, desc } = sort as {
        id: keyof UserTemplate;
        desc: boolean;
      };
      const order = desc ? "desc" : "asc";
      response = await axios.get(
        `${API_BASE_URL}/mvmt/v1/trainer/clients?limit=${size}&pageNo=${pageNo}&sort_by=${id}&sort_order=${order}`,
        {
          withCredentials: true,
        }
      );
    } else {
      response = await axios.get(
        `${API_BASE_URL}/mvmt/v1/trainer/clients?limit=${size}&pageNo=${pageNo}`,
        {
          withCredentials: true,
        }
      );
    }

    const { data, total } = response.data;

    console.log(data.length);
    console.log(total);
    return {
      data: data,
      meta: {
        totalRowCount: total,
      },
    };
  }

  const rightModal = () => {
    return (
      <RightModal
        formTitle="Add User"
        isVisible={showRightModal}
        hideModal={() => {
          setShowRightModal(false);
        }}
      >
        <AddUserForm
          fetchData={() => {
            setAdded((prevAdded) => !prevAdded);
          }}
        />
      </RightModal>
    );
  };

  return (
    <main className="flex flex-col bg-transparent text-black">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row items-center justify-between py-2 border-b-[1px] border-gray-200">
          <span className="text-xl font-bold">All Users</span>
          <TableActions
            onClickNewButton={() => {
              setShowRightModal(true);
            }}
            tableSearchQuery={tableSearchQuery}
            setTableSearchQuery={setTableSearchQuery}
          />
        </div>
        <div>
          <QueryClientProvider client={queryClient}>
            <ScrollTable
              queryKey="allUsers"
              columns={columns}
              fetchData={fetchUsers}
              dataAdded={added}
              dataModified={modified}
              globalFilter={tableSearchQuery}
              setGlobalFilter={setTableSearchQuery}
            />
          </QueryClientProvider>
        </div>
        {rightModal()}
      </div>
    </main>
  );
}
