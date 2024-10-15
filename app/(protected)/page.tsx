import { getCurrentUser } from "@/server_functions/auth";

export default async function Home() {
    const username = await getCurrentUser();

    return (
        // Use only tailwind CSS
        <div className="min-h-screen bg-gray-100">
            {username ? (
                <div className="mt-20 text-center text-2xl font-bold">
                    Hello, {username.name}
                </div>
            ) : (
                <p> Loading ... </p>
            )}
        </div>
    );
}
