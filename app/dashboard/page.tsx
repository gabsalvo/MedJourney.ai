"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { ProjectsView } from "@/components/projects-view"
import { AskMedAIView } from "@/components/ask-med-ai-view"
import { DataLibraryView } from "@/components/data-library-view"
import { ReportsView } from "@/components/reports-view"
import { SettingsView } from "@/components/settings-view"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { SectionCards } from "@/components/section-cards"
import { Skeleton } from "@/components/ui/skeleton"
import data from "./data.json"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
    const router = useRouter()
    const [activeView, setActiveView] = useState<
        "dashboard" | "projects" | "askMedAI" | "dataLibrary" | "reports" | "settings"
    >("dashboard")

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
            <AppSidebar setActiveView={setActiveView} />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col p-6">
                    {activeView === "dashboard" && (
                        <>
                            <SectionCards />
                            <ChartAreaInteractive />
                            <DataTable data={data} />
                        </>
                    )}
                    {activeView === "projects" && <ProjectsView />}
                    {activeView === "askMedAI" && <AskMedAIView />}
                    {activeView === "dataLibrary" && <DataLibraryView />}
                    {activeView === "reports" && <ReportsView />}
                    {activeView === "settings" && <SettingsView />}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
