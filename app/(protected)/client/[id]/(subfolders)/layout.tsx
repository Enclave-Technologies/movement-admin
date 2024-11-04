export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col min-h-screen items-center justify-start p-8 bg-gray-100 text-black w-full">
            <div className="text-center mt-4 flex flex-col items-start gap-8 w-full">
                {children}
            </div>
        </main>
    );
}
