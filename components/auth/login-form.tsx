"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login } from "@/actions/auth_actions";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [state, action, loading] = useActionState(login, "");

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                />
                            </div>
                            <div>
                                {state && (
                                    <p className="text-sm text-red-500">
                                        {state}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <p className="flex items-center gap-2">
                                        <LoaderCircle className="animate-spin" />{" "}
                                        Loading
                                    </p>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                            <Link
                                href="/reset-password"
                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toast.info("Password Reset", {
                                        description:
                                            "This feature will be available soon. Please contact support if you need to reset your password.",
                                    });
                                }}
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/sign-up"
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
