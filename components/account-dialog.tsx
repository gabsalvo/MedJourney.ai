"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOutIcon, UserCircleIcon, CreditCardIcon, SettingsIcon } from "lucide-react"

type Tab = "account" | "billing" | "settings"

export function AccountDialog({
                                  open,
                                  setOpen,
                                  initialTab = "account",
                                  handleLogout,
                              }: {
    open: boolean
    setOpen: (value: boolean) => void
    initialTab?: Tab
    handleLogout: () => void
}) {
    const [activeTab, setActiveTab] = useState<Tab>(initialTab)

    // 🛠️ Ensure the tab updates when the dialog opens with a new `initialTab`
    useEffect(() => {
        if (open) {
            setActiveTab(initialTab)
        }
    }, [open, initialTab])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full
    p-0
    flex
    h-[500px]
    sm:max-w-xl    /* su schermi >= 640px */
    md:max-w-3xl   /* su schermi >= 768px */
    lg:max-w-4xl   /* su schermi >= 1024px */">
                {/* ✅ Add DialogTitle */}
                <DialogTitle className="sr-only">Account Settings</DialogTitle>

                {/* Left Sidebar */}
                <div className="w-1/3 border-r p-4 flex flex-col gap-4">
                    <Button
                        variant={activeTab === "account" ? "default" : "ghost"}
                        onClick={() => setActiveTab("account")}
                        className="w-full justify-start cursor-pointer"
                    >
                        <UserCircleIcon className="w-5 h-5 mr-2" />
                        Account
                    </Button>
                    <Button
                        variant={activeTab === "billing" ? "default" : "ghost"}
                        onClick={() => setActiveTab("billing")}
                        className="w-full justify-start cursor-pointer"
                    >
                        <CreditCardIcon className="w-5 h-5 mr-2" />
                        Billing
                    </Button>
                    <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        onClick={() => setActiveTab("settings")}
                        className="w-full justify-start cursor-pointer"
                    >
                        <SettingsIcon className="w-5 h-5 mr-2" />
                        Settings
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOutIcon className="w-5 h-5 mr-2" />
                        Log out
                    </Button>
                </div>

                {/* Right Content */}
                <div className="w-2/3 p-6">
                    {activeTab === "account" && (
                        <div>
                            <h2 className="text-lg font-semibold">Your Account</h2>
                            <p className="text-sm text-muted-foreground">Update your profile details here.</p>
                        </div>
                    )}
                    {activeTab === "billing" && (
                        <div>
                            <h2 className="text-lg font-semibold">Billing Methods</h2>
                            <p className="text-sm text-muted-foreground">Manage your subscription and invoices.</p>
                        </div>
                    )}
                    {activeTab === "settings" && (
                        <div>
                            <h2 className="text-lg font-semibold">Settings</h2>
                            <p className="text-sm text-muted-foreground">Fine-tune the clustering algorithms.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
