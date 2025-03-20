"use client"

import { useState } from "react"
import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { QuickCreateDialog } from "@/components/quick-create-dialog"

type NavMainProps = {
    items: {
        title: string
        view: "dashboard" | "projects" | "askMedAI"
        icon?: LucideIcon
    }[]
    setActiveView: (view: "dashboard" | "projects" | "askMedAI") => void
}

export function NavMain({ items, setActiveView }: NavMainProps) {
    const [quickCreateOpen, setQuickCreateOpen] = useState(false)

    const subject = encodeURIComponent("Check my MedJourney.ai results")
    const body = encodeURIComponent("Hi there,\n\nThis is might be interesting for our research!")
    const mailtoUrl = `mailto:someone@example.com?subject=${subject}&body=${body}`

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton
                            tooltip="Quick Create"
                            className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground cursor-pointer"
                            onClick={() => setQuickCreateOpen(true)}
                        >
                            <PlusCircleIcon />
                            <span>Quick Clustering</span>
                        </SidebarMenuButton>
                        <Button
                            size="icon"
                            className="h-9 w-9"
                            variant="outline"
                            asChild
                        >
                            {/* asChild means the Button's styles will wrap the anchor */}
                            <a href={mailtoUrl}>
                                <MailIcon />
                                <span className="sr-only">Inbox</span>
                            </a>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                onClick={() => setActiveView(item.view)}
                                className="cursor-pointer min-w-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ease-in-out"
                            >
                                {item.icon && <item.icon className="w-5 h-5" />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
            <QuickCreateDialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen} />
        </SidebarGroup>
    )
}
