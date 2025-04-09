"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Dashboard } from "@/components/DashboardView";
import { AppSidebar } from "@/components/app-sidebar"
import { ProjectsView } from "@/components/projects-view"
import { TakeATourView} from "@/components/TakeATourView";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Skeleton } from "@/components/ui/skeleton"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type ViewType =
    | "dashboard"
    | "projects"
    | "askMedAI"
    | "dataLibrary"
    | "reports"
    | "settings"
    | "takeatour"

export default function Page() {
    const router = useRouter()
    const [activeView, setActiveView] = useState<ViewType>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("activeView") as ViewType | null
            return stored ?? "takeatour"
        }
        return "takeatour"
    })

    const handleSetView = (view: ViewType) => {
        localStorage.setItem("activeView", view)
        setActiveView(view)
    }

    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Check if user is authenticated
    useEffect(() => {
        async function checkSession() {
            const { data: sessionData } = await supabase.auth.getSession()
            if (!sessionData?.session) {
                // Not logged in, redirect to /authentication
                router.push("/authentication")
            } else {
                // User is logged in
                setIsLoggedIn(true)
            }
            setIsLoading(false)
        }
        checkSession()
    }, [router])

    // Show a skeleton UI while we check auth status
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>
        )
    }

    // If not logged in, we do nothing here because we already redirected
    if (!isLoggedIn) {
        return null
    }

    return (
        <SidebarProvider>
            <AppSidebar setActiveView={handleSetView} />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col p-6">
                    {activeView === "dashboard" && (
                        <>
                            <Dashboard setActiveView={handleSetView}/>
                        </>
                    )}
                    {activeView === "projects" && <ProjectsView setCurrentView={handleSetView} />}
                    {activeView === "takeatour" && <TakeATourView setActiveView={setActiveView} />}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
