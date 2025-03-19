"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [passwordError, setPasswordError] = React.useState<string | null>(null)
    const [errorMessage, setErrorMessage] = React.useState<string>("")
    const router = useRouter()

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setErrorMessage("")

        // Optional password complexity check
        if (!validatePassword(password)) {
            setPasswordError(
                "Password must be at least 8 characters, include one uppercase letter, one number, and one special character."
            )
            return
        }

        setIsLoading(true)

        // Register the user via our API route
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
            setErrorMessage(data.error || "Registration failed")
            setIsLoading(false)
            return
        }

        // Registration success
        setIsLoading(false)

        // Option 1: Just send them to login page
        router.push("/login")

        // Option 2 (commented out): automatically log them in immediately
        /*
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) {
          setErrorMessage(signInError.message)
          return
        }
        // If signIn successful, go to dashboard or wherever
        router.push("/dashboard")
        */
    }

    function validatePassword(pass: string): boolean {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return regex.test(pass)
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
                            placeholder="name@example.com"
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

                    {/* Password Input with Validation */}
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="Enter your password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError(null)
                            }}
                            disabled={isLoading}
                            className={cn(
                                "cursor-text",
                                passwordError && "border-red-500 focus:ring-red-500"
                            )}
                        />
                        {passwordError && (
                            <p className="text-red-500 text-xs">{passwordError}</p>
                        )}
                    </div>

                    {/* Register Button */}
                    <Button
                        disabled={isLoading}
                        className="cursor-pointer hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Account
                    </Button>

                    {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                </div>
            </form>
        </div>
    )
}
