import { ClientNavigation } from "@/components/ClientNavigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen items-center justify-start p-8 bg-white text-black w-full">
      <ClientNavigation />
      <div className="text-center mt-4 flex flex-col items-start gap-8 w-full">
        {children}
      </div>
    </main>
  );
}
