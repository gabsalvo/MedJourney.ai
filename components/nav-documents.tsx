"use client"

import {
    type LucideIcon,
} from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavDocuments({
                                 items, setActiveView,
                             }: {
    items: {
        name: string
        view: "dataLibrary" | "reports";
        icon: LucideIcon
    }[];
    setActiveView: (view: "dashboard" | "projects" | "askMedAI" | "dataLibrary" | "reports") => void;
}) {

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name} onClick={() => setActiveView(item.view)}>
                        <SidebarMenuButton className="cursor-pointer">
                                <item.icon />
                                <span>{item.name}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
