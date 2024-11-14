import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server_functions/auth";
import { SESSION_COOKIE_NAME } from "./configs/constants";

const publicPaths = ["/login", "/register"];
const alwaysAccessiblePaths = [
    "/forgot-password",
    "/confirm-password",
    "/images",
];

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    try {
        const user = await getCurrentUser();

        console.log("Requested path:", pathname);
        console.log("Current user:", user);
        // Check if the path is always accessible
        if (alwaysAccessiblePaths.some((path) => pathname.startsWith(path))) {
            return NextResponse.next();
        }

        // Check if the path is public
        if (publicPaths.some((path) => pathname.startsWith(path))) {
            // If user is logged in and trying to access a public path, redirect to home
            if (user) {
                return NextResponse.redirect(new URL("/", request.url));
            }
            // If not logged in, allow access to public paths
            return NextResponse.next();
        }

        // For all other paths (protected routes)
        if (!user) {
            // If not logged in, redirect to login
            console.log("Redirecting to /login");
            request.cookies.delete({
                name: SESSION_COOKIE_NAME,
                httpOnly: true,
                sameSite: "None",
                secure: true,
                path: "/",
                domain: "enclave.live",
            });
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // User is logged in and accessing a protected route
        return NextResponse.next();
    } catch (error) {
        if (error.type === "general_unauthorized_scope") {
            request.cookies.delete({
                name: SESSION_COOKIE_NAME,
                httpOnly: true,
                sameSite: "None",
                secure: true,
                path: "/",
                domain: "enclave.live",
            });
            return NextResponse.redirect(new URL("/login", request.url));
        } else {
            console.error("Middleware error:", error.type);
            // You might want to add some error handling here
            return NextResponse.next();
        }
    }
}

// Configuration object for the middleware
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|/public/.*).*)"],
};
