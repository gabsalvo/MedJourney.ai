"use client";

import * as React from "react";
import {
    ClipboardListIcon,
    DatabaseIcon,
    FolderIcon,
    HelpCircleIcon,
    BrainCircuitIcon,
    SparklesIcon,
    ActivityIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

// Define Props to accept setActiveView
type AppSidebarProps = {
    setActiveView: (view: "dashboard" | "projects" | "askMedAI" | "dataLibrary" | "reports" | "settings") => void;
};

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Analyze",
            view: "dashboard" as const,
            icon: BrainCircuitIcon,
        },
        {
            title: "Projects",
            view: "projects" as const,
            icon: FolderIcon,
        },
        {
            title: "Ask Med.ai",
            view: "askMedAI" as const,
            icon: SparklesIcon,
        },
    ],
    navSecondary: [
        /*{
            title: "Settings",
            view: "settings" as const,
            icon: SettingsIcon,
        },*/
        {
            title: "Get Help",
            url: "https://medjourney-ai.hashnode.space/",
            icon: HelpCircleIcon,
        },
    ],
    documents: [
        {
            name: "Data Library",
            view: "dataLibrary" as const,
            icon: DatabaseIcon,
        },
        {
            name: "Reports",
            view: "reports" as const,
            icon: ClipboardListIcon,
        },
    ],
};

export function AppSidebar({ setActiveView, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <ActivityIcon className="h-5 w-5 text-blue-500" />
                                <span className="text-base font-semibold">
                                    Med<span className="text-blue-500">Journey</span>.ai
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} setActiveView={setActiveView} /> {/* ✅ Pass setActiveView */}
                <NavDocuments items={data.documents} setActiveView={setActiveView} />
                <NavSecondary items={data.navSecondary}  setActiveView={setActiveView} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
        </Sidebar>
    );
}
