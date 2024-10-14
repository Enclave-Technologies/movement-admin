import "../globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <h1>Auth pages</h1>
            <div>{children}</div>
        </main>
    );
}
