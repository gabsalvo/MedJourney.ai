import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserLogForm } from "@/components/user-log-form"
import Image from "next/image";

export const metadata: Metadata = {
    title: "MedJourney.ai | Login",
    description: "Clustering medical data for deeper insights",
};

export default function AuthenticationPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-6 sm:px-8 relative">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 md:left-8 md:top-8 z-50 cursor-pointer"
                )}
            >
                <Image
                    className="dark:invert"
                    src="/medjourneylogo.svg"
                    alt="MedJourney.ai logo"
                    width={180}
                    height={50}
                    priority
                />
            </Link>
            {/* Login button - Fixed for both mobile & desktop */}
            <Link
                href="/authentication"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute right-4 top-4 md:right-8 md:top-8 z-50 cursor-pointer"
                )}
            >
                Sign In
            </Link>

            {/* Desktop Layout */}
            <div className=" flex items-center justify-center h-full">
                {/* Create Account Form - Visible on desktop */}
                <div className="flex items-center justify-center w-full p-6 sm:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Welcome Back!
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email and password below to log in to your existing account
                            </p>
                        </div>
                        <UserLogForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
