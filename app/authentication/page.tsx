import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/user-auth-form"

export const metadata: Metadata = {
    title: "MedJourney.ai | Register",
    description: "Clustering medical data for deeper insights",
};
export default function AuthenticationPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-6 sm:px-8 relative">
            {/* Login button - Fixed for both mobile & desktop */}
            <Link
                href="/login"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute right-4 top-4 md:right-8 md:top-8 z-50 cursor-pointer"
                )}
            >
                Login
            </Link>

            {/* Desktop Layout */}
            <div className="container relative hidden md:grid h-screen lg:max-w-none lg:grid-cols-2 lg:px-0">
                {/* Sidebar - Hidden on mobile */}
                <div className="relative hidden lg:flex h-full flex-col bg-muted p-10 text-white dark:border-r">
                    <div className="absolute inset-0 bg-primary" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer hover:bg-zinc-700")}>
                        <Image
                            className="dark:invert"
                            src="/medjourneylogoalt.svg"
                            alt="MedJourney.ai logo"
                            width={180}
                            height={50}
                            priority
                        />
                        </Link>
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;This library has saved me countless hours of work and
                                helped me deliver stunning designs to my clients faster than
                                ever before.&rdquo;
                            </p>
                            <footer className="text-sm">Sofia Davis</footer>
                        </blockquote>
                    </div>
                </div>

                {/* Create Account Form - Visible on desktop */}
                <div className="hidden md:flex items-center justify-center p-6 sm:p-8 w-full">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Create an account
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email below to create your account
                            </p>
                        </div>
                        <UserAuthForm />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary cursor-pointer"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary cursor-pointer"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Layout - Only shows Create Account */}
            <div className="md:hidden w-full max-w-md">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground mb-5">
                        Enter your email below to create your account
                    </p>
                </div>
                <UserAuthForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
