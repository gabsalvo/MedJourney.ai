"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { createClient } from "@supabase/supabase-js"

import {
    CreditCardIcon,
    LogOutIcon,
    MoreVerticalIcon,
    UserCircleIcon,
    SettingsIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

import { AccountDialog } from "@/components/account-dialog"

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function NavUser() {
    const router = useRouter()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogTab, setDialogTab] = useState<"account" | "billing" | "settings">("account")
    const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null)
    const [loading, setLoading] = useState(true)

    // ✅ Fetch authenticated user with proper session handling
    useEffect(() => {
        async function fetchUser() {
            try {
                const { data: session, error: sessionError } = await supabase.auth.getSession()

                if (sessionError || !session?.session) {
                    console.warn("No active session, user is logged out.")
                    setLoading(false)
                    return
                }

                const { data, error } = await supabase.auth.getUser()

                if (error || !data?.user) {
                    console.error("Error fetching user:", error)
                    setLoading(false)
                    return
                }

                setUser({
                    name: data.user.email?.split("@")[0] || "User",
                    email: data.user.email || "No email",
                    avatar: data.user.user_metadata?.avatar_url || "", // Add avatar if available
                })
            } catch (error) {
                console.error("Error retrieving user:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    async function handleLogout() {
        try {
            await supabase.auth.signOut()
            await signOut({ redirect: false })
            router.push("/")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <>
            {/* Account Dialog */}
            <AccountDialog open={dialogOpen} setOpen={setDialogOpen} initialTab={dialogTab} handleLogout={handleLogout} />

            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className="cursor-pointer">
                                <Avatar className="h-8 w-8 rounded-lg grayscale">
                                    {user?.avatar ? (
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                    ) : (
                                        <AvatarFallback className="rounded-lg">
                                            {user?.name.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {loading ? "Loading..." : user?.name || "Guest"}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {loading ? "Loading..." : user?.email || "Not logged in"}
                                    </span>
                                </div>
                                <MoreVerticalIcon className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {user?.avatar ? (
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                        ) : (
                                            <AvatarFallback className="rounded-lg">
                                                {user?.name.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {loading ? "Loading..." : user?.name || "Guest"}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {loading ? "Loading..." : user?.email || "Not logged in"}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setDialogTab("account")
                                        setDialogOpen(true)
                                    }}
                                >
                                    <UserCircleIcon />
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setDialogTab("billing")
                                        setDialogOpen(true)
                                    }}
                                >
                                    <CreditCardIcon />
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setDialogTab("settings")
                                        setDialogOpen(true)
                                    }}
                                >
                                    <SettingsIcon />
                                    Settings
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                                <LogOutIcon />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}
