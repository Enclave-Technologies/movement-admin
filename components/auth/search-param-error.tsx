"use client";

import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

const SearchParamError = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    
    if (!error) return null;
    
    const errorMessages: Record<string, { title: string, description: string, variant: "destructive" | "default" }> = {
        "missing_account_scope": {
            title: "Authentication Error",
            description: "You do not have the required permissions to access this page. Please log in with an account that has the necessary scope.",
            variant: "destructive"
        },
        "user_fetch_error": {
            title: "Server Error",
            description: "We encountered an issue while fetching your account information. Please try again later or contact support if the problem persists.",
            variant: "destructive"
        },
        "session_expired": {
            title: "Session Expired",
            description: "Your session has expired. Please log in again to continue.",
            variant: "default"
        },
        "invalid_credentials": {
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please try again.",
            variant: "destructive"
        }
    };
    
    const errorInfo = errorMessages[error] || {
        title: "Error",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive"
    };
    
    return (
        <Alert variant={errorInfo.variant} className="mb-4">
            {errorInfo.variant === "destructive" ? (
                <AlertCircle className="h-4 w-4" />
            ) : (
                <Info className="h-4 w-4" />
            )}
            <AlertTitle>{errorInfo.title}</AlertTitle>
            <AlertDescription>
                {errorInfo.description}
            </AlertDescription>
        </Alert>
    );
};

export default SearchParamError;
