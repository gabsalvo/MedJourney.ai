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

type UserLogFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserLogForm({ className, ...props }: UserLogFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [errorMessage, setErrorMessage] = React.useState<string>("")
    const router = useRouter()

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setErrorMessage("")
        setIsLoading(true)

        // Log in with Supabase
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setErrorMessage(error.message)
            setIsLoading(false)
        } else {
            // data.session contains the session
            // data.user has the user
            setIsLoading(false)
            router.push("/dashboard")
        }
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

                    {/* Password Input */}
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="Enter your password"
                            type="password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="cursor-text"
                        />
                    </div>

                    {/* Log In Button */}
                    <Button
                        disabled={isLoading}
                        className="cursor-pointer hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Log In
                    </Button>
                    <a
                        href="/reset"
                        className="text-xs mt-2 text-zinc-600 font-semibold hover:text-zinc-800"
                    >
                        Forgot your Password?
                    </a>
                    {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                </div>
            </form>
        </div>
    )
}
