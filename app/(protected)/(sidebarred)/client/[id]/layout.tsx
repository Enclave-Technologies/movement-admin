// // app/(protected)/client/layout.tsx
// "use client";
// import { UserProvider } from "@/context/ClientContext";
// import { useParams, useRouter } from "next/navigation";
// import { IoIosArrowBack } from "react-icons/io";

// const ClientLayout = ({ children }: { children: React.ReactNode }) => {
//     const params = useParams();
//     const router = useRouter();

//     if (!params.id) {
//         return <div>Error: {JSON.stringify(params)}</div>;
//     }

//     const handleBack = () => {
//         router.back();
//     };

//     return (
//         <UserProvider params={params}>
//             <div className="relative min-h-screen">
//                 <button
//                     onClick={handleBack}
//                     className="absolute top-4 left-4 sm:top-6 sm:left-6 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md"
//                 >
//                     <IoIosArrowBack className="text-gold-500 text-4xl font-bold hover:text-green-500" />
//                 </button>
//                 <div className="flex-grow p-4 sm:p-6 bg-gray-100">
//                     {children}
//                 </div>
//             </div>
//         </UserProvider>
//     );
// };

// export default ClientLayout;
"use client";
import { UserProvider } from "@/context/ClientContext";
import { useParams } from "next/navigation";
import ClientLayoutContent from "@/components/ClientLayoutContent";
import { useEffect } from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    const params = useParams();

    useEffect(() => {
        if (!params.id) {
            window.location.href = "/"; // Redirect to home if the param is missing
        }
    }, [params.id]);

    if (!params.id) {
        return <div>Error: {JSON.stringify(params)}</div>;
    }

    return (
        <UserProvider params={params}>
            <ClientLayoutContent>{children}</ClientLayoutContent>
        </UserProvider>
    );
};

export default ClientLayout;
