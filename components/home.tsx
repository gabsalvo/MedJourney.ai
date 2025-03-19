"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client (if you don't already have a shared client)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HomeContent() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Check Supabase session on mount
    useEffect(() => {
        async function checkSession() {
            const { data } = await supabase.auth.getSession()
            if (data.session) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }
        }
        checkSession()
    }, [])

    // Handle "Get Started" click
    const handleGetStarted = (e: React.MouseEvent) => {
        e.preventDefault()
        if (isLoggedIn) {
            router.push("/dashboard") // Redirect logged-in users to the dashboard
        } else {
            router.push("/authentication") // Redirect guests to authentication
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="/medjourneylogo.svg"
                    alt="MedJourney.ai logo"
                    width={350}
                    height={50}
                    priority
                />
                <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                    <li className="mb-2 tracking-[-.01em]">
                        Login →
                        <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                            Dashboard
                        </code>
                    </li>
                    <li className="tracking-[-.01em]">
                        Upload File →
                        <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                            View Clustering Results
                        </code>
                    </li>
                </ol>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <button
                        onClick={handleGetStarted}
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto cursor-pointer"
                    >
                        <Image
                            className="dark:invert"
                            src="/getstarted.svg"
                            alt="Get Started"
                            width={25}
                            height={25}
                        />
                        Get started
                    </button>
                    <a
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                        href="https://medjourney-ai.hashnode.space/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Read our docs
                    </a>
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://developers.google.com/machine-learning/clustering/overview"
                >
                    <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://developers.google.com/machine-learning/clustering/clustering-algorithms"
                >
                    <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
                    Examples
                </a>
            </footer>
        </div>
    )
}
