"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import UsersTable from "@/components/UsersTable";
import Searchbar from "@/components/pure-components/Searchbar";
import AddUserForm from "@/components/forms/add-user-form";
import RightModal from "@/components/pure-components/RightModal";
import { ColumnDef, ColumnSort, SortingState } from "@tanstack/react-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollTable from "@/components/InfiniteScrollTable/ScrollTable";
import { defaultProfileURL, LIMIT } from "@/configs/constants";
import Pagination from "@/components/pure-components/Pagination";
import UserSkeleton from "@/components/pageSkeletons/userSkeleton";
import { API_BASE_URL } from "@/configs/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TbArrowsSort, TbFilter, TbSearch } from "react-icons/tb";
import { TiSortAlphabetically } from "react-icons/ti";
import { MdOutlineMail, MdOutlinePerson, MdOutlinePhone } from "react-icons/md";

// export default function AllClients() {
//     const [clients, setClients] = useState<Client[]>([]); // State to hold the clients data
//     const [lastId, setLastId] = useState<number>(1); // State to hold the last ID of the fetched clients
//     const [totalPages, setTotalPages] = useState<number>(1); // State to hold the last ID of the fetched clients

//     const [search, setSearch] = useState("");
//     const [pageLoading, setPageLoading] = useState(true);
//     const [showRightModal, setShowRightModal] = useState(false);
//     const { countDoc, reloadData, users } = useGlobalContext();

//     useEffect(() => {
//         const fetchData = async () => {
//             if (users) {
//                 const myClients = users.filter(
//                     (user) =>
//                         user.name
//                             .toLowerCase()
//                             .includes(search.toLowerCase()) ||
//                         user.email
//                             ?.toLowerCase()
//                             .includes(search.toLowerCase()) ||
//                         user.phone?.toLowerCase().includes(search.toLowerCase())
//                 );

//                 setTotalPages(Math.ceil(myClients.length / LIMIT));
//                 const startIndex = (lastId - 1) * LIMIT;
//                 const endIndex = startIndex + LIMIT;

//                 setClients(myClients.slice(startIndex, endIndex));
//             }
//         };
//         fetchData();
//     }, [users, lastId, search]);

//     const rightModal = () => {
//         return (
//             <RightModal
//                 formTitle="Add User"
//                 isVisible={showRightModal}
//                 hideModal={() => {
//                     setShowRightModal(false);
//                 }}
//             >
//                 <AddUserForm fetchData={reloadData} />
//             </RightModal>
//         );
//     };

//     if (users.length === 0)
//         return (
//             <UserSkeleton
//                 button_text="Add User"
//                 pageTitle="All Users"
//                 buttons={totalPages}
//                 active_page={lastId}
//             />
//         );

//     return (
//         <main className="flex flex-col bg-gray-100 text-black">
//             <div className="w-full flex flex-col gap-4">
//                 <div className="w-full flex flex-row items-center justify-between">
//                     <h1 className="text-xl font-bold text-black ml-2 leading-tight">
//                         All Users
//                     </h1>
//                     <button
//                         onClick={() => {
//                             setShowRightModal(true);
//                         }}
//                         className="bg-primary text-white py-2 px-4 rounded-md"
//                     >
//                         + Add User
//                     </button>
//                 </div>

//                 <div className="w-full overflow-x-auto">
//                     <UsersTable clients={clients} search={search} />
//                 </div>

//                 <Pagination
//                     totalPages={totalPages}
//                     pageNo={lastId}
//                     handlePageChange={(page: number) => {
//                         setLastId(page);
//                     }}
//                 />
//                 {rightModal()}
//             </div>
//         </main>
//     );
// }

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
        <div className="w-full flex flex-row items-center justify-between">
          <span className="text-xl font-bold">All Users</span>
          <TableActions
            setShowRightModal={setShowRightModal}
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

const TableActions = ({
  setShowRightModal,
  tableSearchQuery,
  setTableSearchQuery,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  return (
    <div className="flex flex-row gap-[4px] items-center">
      <div className="flex flex-row items-center">
        <button className="hover:bg-gray-300 h-8 w-8 rounded-md flex items-center justify-center text-gray-600">
          <TbArrowsSort />
        </button>
        <button className="hover:bg-gray-300 h-8 w-8 rounded-md flex items-center justify-center text-gray-600">
          <TbFilter />
        </button>
        <div className="flex flex-row items-center">
          <button
            className="hover:bg-gray-300 h-8 w-8 rounded-md flex items-center justify-center text-gray-600"
            onClick={() => setIsSearchExpanded((prev) => !prev)}
          >
            <TbSearch />
          </button>
          <input
            value={tableSearchQuery}
            onChange={(e) => {
              setTableSearchQuery(e.target.value);
            }}
            placeholder="Type to search..."
            className={`${
              isSearchExpanded ? "w-52" : "w-0"
            } bg-transparent focus:outline-none transition-all duration-300 ease-in-out`}
            autoFocus={isSearchExpanded}
          />
        </div>
      </div>
      <button
        onClick={() => {
          setShowRightModal(true);
        }}
        className="bg-primary hover:bg-green-900 text-white px-4 h-8 rounded-md"
      >
        New
      </button>
    </div>
  );
};
