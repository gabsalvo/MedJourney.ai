"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { ProjectsView } from "@/components/projects-view";
import { AskMedAIView } from "@/components/ask-med-ai-view";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json";

export default function Page() {
    const [activeView, setActiveView] = useState<"dashboard" | "projects" | "askMedAI">("dashboard");

    return (
        <SidebarProvider>
            <AppSidebar setActiveView={setActiveView} /> {/* ✅ Pass setActiveView */}
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col p-6">
                    {/* Dynamically render content based on activeView */}
                    {activeView === "dashboard" && (
                        <>
                            <SectionCards />
                            <ChartAreaInteractive />
                            <DataTable data={data} />
                        </>
                    )}
                    {activeView === "projects" && <ProjectsView />}
                    {activeView === "askMedAI" && <AskMedAIView />}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
