import { get_user_if_logged_in } from "@/actions/appwrite_actions";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LandingNav } from "@/components/landing-page/landing-nav";
import { LandingHero } from "@/components/landing-page/landing-hero";
import { LandingFeatures } from "@/components/landing-page/landing-features";

// Server Component
export default async function Home() {
    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;
    // Check if the user is already logged in (Server-side)
    const user = await get_user_if_logged_in(session);

    if (user) {
        // Redirect logged-in users server-side
        redirect("/my-clients");
    }

    return (
        <div className="flex flex-col min-h-dvh bg-black text-white">
            {/* Use the new navigation component */}
            <LandingNav />

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                <LandingHero />
                <LandingFeatures />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-black">
                <div className="container mx-auto flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-8">
                    <p className="text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} GymFlow. All rights
                        reserved.
                    </p>
                    <nav className="sm:ml-auto flex gap-6">
                        <Link
                            href="#"
                            className="text-xs text-gray-400 hover:text-white transition-colors hover:underline underline-offset-4"
                            prefetch={false}
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="#"
                            className="text-xs text-gray-400 hover:text-white transition-colors hover:underline underline-offset-4"
                            prefetch={false}
                        >
                            Privacy Policy
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
