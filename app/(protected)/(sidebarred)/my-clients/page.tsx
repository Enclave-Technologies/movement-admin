"use client";
import AddUserForm from "@/components/forms/add-user-form";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";
import TableActions from "@/components/InfiniteScrollTable/TableActions";
import LoadingSpinner from "@/components/LoadingSpinner";
import ScrollTableSkeleton from "@/components/pageSkeletons/scrollTableSkeleton";
import RightModal from "@/components/pure-components/RightModal";
import Searchbar from "@/components/pure-components/Searchbar";
import { API_BASE_URL, defaultProfileURL } from "@/configs/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Page = () => {
  const { myDetails } = useGlobalContext();
  const [modified, setModified] = useState(true);
  const [added, setAdded] = useState(true);
  const [showRightModal, setShowRightModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();
  const queryClient = new QueryClient();
  const [isFetching, setIsFetching] = useState(false);

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
              width={32}
              height={32}
              alt={`Image of ${info.row.original.name}`}
              className="rounded-full"
            />
          </div>
        ),
        size: 50,
        enableSorting: false,
      },
      {
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
        header: "Email",
        accessorKey: "email",
        size: 250,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        size: 150,
      },
      {
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
    const pageNo = start / size + 1;

    const url = new URL(`${API_BASE_URL}/mvmt/v1/trainer/clients`);

    url.searchParams.set("limit", size.toString());
    url.searchParams.set("tid", myDetails?.$id);
    url.searchParams.set("pageNo", pageNo.toString());

    if (sorting.length) {
      const sort = sorting[0] as ColumnSort;
      const { id, desc } = sort;
      url.searchParams.set("sort_by", id);
      url.searchParams.set("sort_order", desc ? "desc" : "asc");
    }

    if (globalFilter) {
      url.searchParams.set("search_query", globalFilter);
    }

    const response = await axios.get(url.toString(), {
      withCredentials: true,
    });

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
          trainerId={myDetails?.$id}
        />
      </RightModal>
    );
  };

  if (!myDetails) {
    return <ScrollTableSkeleton columnCount={columns.length} rowCount={10} />;
  }

  return (
    <main className="flex flex-col bg-transparent text-black">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row items-center justify-between py-2 border-b-[1px] border-gray-200">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-lg font-bold">My Clients</span>
            {isFetching && <LoadingSpinner className="h-4 w-4" />}
          </div>
          <TableActions
            onClickNewButton={() => {
              setShowRightModal(true);
            }}
            setTableSearchQuery={setGlobalFilter}
            tableSearchQuery={globalFilter}
          />
        </div>
        {/* <Searchbar
                    search={globalFilter}
                    setSearch={setGlobalFilter}
                    placeholder="Search"
                /> */}
        <div>
          <QueryClientProvider client={queryClient}>
            <ScrollTable
              queryKey="allUsers"
              columns={columns}
              fetchData={fetchUsers}
              dataAdded={added}
              dataModified={modified}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              setIsFetching={setIsFetching}
            />
          </QueryClientProvider>
        </div>
        {rightModal()}
      </div>
    </main>
  );
};

export default Page;
