"use client";

import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SearchParamError = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    return (
        <div>
            {error === "missing_account_scope" && (
                <Alert variant="destructive">
                    <AlertDescription>
                        You do not have the required permissions to access this
                        page. Please log in with an account that has the
                        necessary scope.
                    </AlertDescription>
                </Alert>
            )}
            {error === "user_fetch_error" && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Unknown error occurred while fetching user account.
                        Please try again later or contact support.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default SearchParamError;
