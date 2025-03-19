"use client"

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PencilIcon } from "lucide-react"

export function SiteHeader() {
    const [name, setName] = useState("Dr. John Doe") // Default placeholder
    const [isEditing, setIsEditing] = useState(false)

    // Load name from localStorage on mount
    useEffect(() => {
        const storedName = localStorage.getItem("user-name")
        if (storedName) setName(storedName)
    }, [])

    // Save name to localStorage when it changes
    const saveName = (newName: string) => {
        setName(newName)
        localStorage.setItem("user-name", newName)
    }

    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1 cursor-pointer" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

                {/* Editable Name */}
                <div className="relative flex items-center gap-2">
                    <span className="text-base font-medium">Hello,</span>

                    {isEditing ? (
                        <input
                            type="text"
                            autoFocus
                            value={name}
                            onChange={(e) => saveName(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                            className="border-b border-blue-400 bg-transparent text-base font-medium outline-none w-auto"
                        />
                    ) : (
                        <span
                            className="text-base font-medium cursor-pointer"
                            onClick={() => setIsEditing(true)}
                        >
                            {name}
                        </span>
                    )}

                    <PencilIcon
                        className="h-4 w-4 text-blue-600 opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    />
                </div>
            </div>
        </header>
    )
}
