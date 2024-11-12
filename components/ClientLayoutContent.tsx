"use client";
import { useUser } from "@/context/ClientContext";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
    const { userError, userLoading } = useUser();
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    if (userError) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-gray-100 text-black w-full">
                <div className="text-center p-8 bg-red-100 border-2 border-red-500 rounded-xl">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">
                        Error
                    </h2>
                    <p className="text-red-600">
                        {userError.message ||
                            "An error occurred while fetching user data."}
                    </p>
                </div>
            </div>
        );
    }

    if (userLoading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-gray-100 text-black w-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                        Loading...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <button
                onClick={handleBack}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md"
            >
                <IoIosArrowBack className="text-gold-500 text-4xl font-bold hover:text-green-500" />
            </button>
            <div className="flex-grow p-4 sm:p-6 bg-gray-100">{children}</div>
        </div>
    );
};

export default ClientLayoutContent;
