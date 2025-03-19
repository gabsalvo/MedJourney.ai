"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [errorMessage, setErrorMessage] = React.useState("")
    const [successMessage, setSuccessMessage] = React.useState("")
    const [accessToken, setAccessToken] = React.useState<string | null>(null)

    // Regex per validare la password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const token = hashParams.get("access_token")
            setAccessToken(token)
        }
    }, [])

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")

        if (!accessToken) {
            setErrorMessage("Invalid or missing reset token.")
            return
        }

        if (!passwordRegex.test(password)) {
            setErrorMessage("Password must be at least 8 characters, include one uppercase letter, one number, and one special character.")
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.")
            return
        }

        // 🔑 Passa il token nel `auth.updateUser`
        const { error } = await supabase.auth.updateUser(
            { password: password },
            // @ts-expect-error Supabase updateUser does not officially support accessToken, but it is required in this context.
            { accessToken: accessToken }
        )

        if (error) {
            setErrorMessage(error.message)
        } else {
            setSuccessMessage("Password successfully updated! Redirecting...")
            setTimeout(() => router.push("/login"), 2000)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-8">
            <h1 className="text-2xl font-semibold mb-2">Reset Your Password</h1>
            <p className="text-sm text-muted-foreground mb-5">
                Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className={cn("grid gap-4 w-full max-w-sm p-6 bg-white shadow-lg rounded-md")}>
                {/* Password Input */}
                <div className="grid gap-1">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={password && !passwordRegex.test(password) ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {!passwordRegex.test(password) && password && (
                        <p className="text-red-500 text-xs">
                            Password must be at least 8 characters, include one uppercase letter, one number, and one special character.
                        </p>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className="grid gap-1">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={confirmPassword && password !== confirmPassword ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {password !== confirmPassword && confirmPassword && (
                        <p className="text-red-500 text-xs">Passwords do not match.</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={!passwordRegex.test(password) || password !== confirmPassword}>
                    Update Password
                </Button>

                {/* Feedback Messages */}
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
            </form>
        </div>
    )
}
