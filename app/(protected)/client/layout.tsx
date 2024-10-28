// app/(protected)/client/[id]/layout.tsx
"use client";
import { UserProvider } from "@/context/ClientContext";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    const params = useParams();
    const router = useRouter();
    // Ensure params.id is defined
    if (!params.id) {
        return <div>Error: {JSON.stringify(params)}</div>;
    }

    const handleBack = () => {
        router.back();
    };

    return (
        <UserProvider params={params}>
            <div className="flex">
                <button onClick={handleBack} className="w-16 h-16">
                    <IoIosArrowBack
                        className="text-gold-500 text-4xl font-bold
                    hover:text-green-500"
                    />
                </button>

                <div className="flex-grow p-2">{children}</div>
            </div>
        </UserProvider>
    );
};

export default ClientLayout;
