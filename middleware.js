// Importing the necessary modules and constants
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server_functions/auth";
import { SESSION_COOKIE_NAME } from "./configs/constants";

export async function middleware(request) {
    try {
        // Get the user information using the auth module
        const user = await getCurrentUser();

        // Log a message indicating that the middleware ran successfully
        console.log("Middleware Ran with user ", user);

        // If user is not authenticated and the path is not /login or /register, remove session cookie and redirect to login page
        if (
            !user &&
            !request.nextUrl.pathname.startsWith("/login") &&
            !request.nextUrl.pathname.startsWith("/register") &&
            !request.nextUrl.pathname.startsWith("/forgot-password")
        ) {
            console.log("Trying to redirect to /login");
            request.cookies.delete({ name: SESSION_COOKIE_NAME });
            return NextResponse.redirect(new URL("/login", request.url));
        }
        // Check if the path is either login or register and redirect accordingly
        if (
            user &&
            (request.nextUrl.pathname === "/login" ||
                request.nextUrl.pathname === "/register")
        ) {
            console.log("REDIRECTING TO HOME", user);
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Continue with the next middleware in the pipeline
        return NextResponse.next();
    } catch (error) {
        if (error.type === "general_unauthorized_scope") {
            request.cookies.delete({ name: SESSION_COOKIE_NAME, path: "/" });
            return NextResponse.redirect(new URL("/login", request.url));
        } else {
            console.log("CONSOLE LOG MIDDLEWARE", error.type);
        }
    }
}

// Configuration object for the middleware
export const config = {
    matcher: ["/", "/login", "/register"], // Specifies the URL path that this middleware should run on
};
