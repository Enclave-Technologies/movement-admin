import "../globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <h1 className="flex items-center justify-center text-lg bg-green-700 text-white">
                Auth pages
            </h1>
            <div>{children}</div>
        </main>
    );
}
