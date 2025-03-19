"use client"

import * as React from "react"
import { createClient } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function UserResetForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [message, setMessage] = React.useState<string>("")
    const [errorMessage, setErrorMessage] = React.useState<string>("")

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setMessage("")
        setErrorMessage("")
        setIsLoading(true)

        // 🔹 Send Password Reset Email via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            setErrorMessage(error.message)
        } else {
            setMessage("Check your email for the reset link.")
        }

        setIsLoading(false)
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    {/* Email Input */}
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="Enter your email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="cursor-text"
                        />
                    </div>
                    {/* Reset Button */}
                    <Button
                        disabled={isLoading}
                        className="cursor-pointer hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                    {/* Success & Error Messages */}
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                </div>
            </form>
        </div>
    )
}
