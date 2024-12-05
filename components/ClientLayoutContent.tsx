"use client";
import { useUser } from "@/context/ClientContext";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import PageLoading from "./PageLoading";

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { userError, userLoading } = useUser();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  if (userError) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-gray-50 text-black w-full">
        <div className="text-center p-8 bg-red-100 border-2 border-red-500 rounded-xl">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-red-600">
            {userError.message || "An error occurred while fetching user data."}
          </p>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return <PageLoading />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex-grow p-2 sm:p-2 bg-gray-50">
        <button
          onClick={handleBack}
          className="flex items-center justify-center"
        >
          <IoIosArrowBack className="text-black text-2xl font-bold hover:text-green-500" />
          <p>Back</p>
        </button>
        {children}
      </div>
    </div>
  );
};

export default ClientLayoutContent;
