import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { TrainerProvider } from "@/context/TrainerContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <div className="flex flex-col h-screen">
                <div className="flex flex-1 flex-row">
                    <TrainerProvider>
                        <Sidebar />
                    </TrainerProvider>
                    <div className="flex-1 bg-gray-100 px-4">{children}</div>
                </div>
            </div>
        </div>
    );
}
