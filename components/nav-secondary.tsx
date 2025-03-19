"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
                                 items,
                                 setActiveView,
                                 ...props
                             }: {
    items: {
        title: string;
        view?: "settings"; // ✅ Only settings is dynamic
        url?: string; // ✅ External link for Get Help
        icon: LucideIcon;
    }[];
    setActiveView: (view: "dashboard" | "projects" | "askMedAI" | "dataLibrary" | "reports" | "settings") => void;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.view ? (
                                // ✅ Only call setActiveView if item.view is defined
                                <SidebarMenuButton
                                    onClick={() => item.view && setActiveView(item.view)} className="cursor-pointer"
                                >
                                    <item.icon />
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            ) : (
                                // ✅ External link for "Get Help"
                                <SidebarMenuButton asChild>
                                    <a href={item.url} target="_blank">
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
