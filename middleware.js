import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies
import { getCurrentUser } from "@/server_functions/auth";
import { SESSION_COOKIE_NAME } from "./configs/constants"; // Import cookie name

// Define public paths that do not require authentication
const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/confirm-password",
];
// Define paths/prefixes that should always be allowed (assets, API routes, etc.)
const alwaysAllowedPrefixes = [
    "/images",
    "/api",
    "/_next/static",
    "/_next/image",
    "/favicon.ico",
];

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow requests for static assets, API routes, etc., to pass through without checks
    if (alwaysAllowedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.next();
    }

    // Log cookie presence *before* calling getCurrentUser
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    console.log(
        `[middleware] Checking for cookie ${SESSION_COOKIE_NAME} for path ${pathname}. Found: ${!!sessionCookie}`
    );
    if (sessionCookie) {
        // Avoid logging the full sensitive session value
        console.log(`[middleware] Cookie ${SESSION_COOKIE_NAME} exists.`);
    }

    let isAuthenticated = false;
    try {
        // Check if the user has a valid session
        console.log(
            `[middleware] Calling getCurrentUser for path ${pathname}...`
        );
        const user = await getCurrentUser();
        isAuthenticated = !!user; // Convert user object (or null) to boolean
        console.log(
            `[middleware] getCurrentUser result for path ${pathname}: isAuthenticated=${isAuthenticated}`
        );
    } catch (error) {
        // Log the error but treat as unauthenticated for routing purposes
        // This handles cases where the session check itself fails
        console.error("Error fetching user in middleware:", error);
        isAuthenticated = false;
        // Note: We don't delete cookies here. If the session is invalid,
        // Note: We will delete the cookie *if* we redirect due to this error.
    }

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Handle redirection logic based on authentication status and path type
    if (isPublicPath) {
        // If the user is authenticated and tries to access a public path (e.g., /login)
        if (isAuthenticated) {
            // Redirect them to a default authenticated page (e.g., dashboard or /my-clients)
            console.log(
                `Redirecting authenticated user from public path ${pathname} to /my-clients`
            );
            return NextResponse.redirect(new URL("/my-clients", request.url));
        }
        // If the user is not authenticated, allow access to the public path
        return NextResponse.next();
    } else {
        // This is a protected path
        // If the user is not authenticated
        if (!isAuthenticated) {
            // User is not authenticated, redirect to login
            // No need to manually delete cookies here, as getCurrentUser handles invalid sessions,
            // and logout handles explicit session deletion including cookies via the SDK.
            const loginUrl = new URL("/login", request.url);
            console.log(
                `Redirecting unauthenticated user from protected path ${pathname} to /login`
            );
            return NextResponse.redirect(loginUrl);
        }
        // User is authenticated, allow access to the protected path
        return NextResponse.next();
    }
}

// Configuration object for the middleware
export const config = {
    // Matcher ensures the middleware runs on relevant paths, excluding static assets, etc.
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
