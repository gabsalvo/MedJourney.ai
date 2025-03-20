"use client"

import React, { useState } from "react"
import { SendIcon, SparklesIcon } from "lucide-react"

// shadcn/ui components
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const mockMessages = [
    { role: "assistant", content: "Hello! How can I help you?" },
    { role: "user", content: "How many clusters should I use?" },
    { role: "assistant", content: "I'd say K=5" },
]

export function AskMedAIView() {
    const [messages, setMessages] = useState(mockMessages)
    const [input, setInput] = useState("")

    function handleSend() {
        if (!input.trim()) return
        const newMessage = { role: "user", content: input.trim() }
        setMessages((prev) => [...prev, newMessage])
        setInput("")

        // Simulate AI response (mock)
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "This is a mock AI response." },
            ])
        }, 600)
    }

    return (
        <div className="h-screen bg-gray-50">
            {/* Header */}
            <header className="h-14 border-b px-4 flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h1 className="text-lg font-semibold">Chat with Med.ai</h1>
            </header>

            {/* Main container with relative positioning */}
            <div className="relative h-[calc(100%-3.5rem)]">
                {/* Scrollable messages area */}
                <ScrollArea className="absolute inset-0 overflow-y-auto px-4 py-4">
                    <div className="mx-auto max-w-xl pb-24"> {/* Extra bottom padding */}
                        {messages.map((msg, idx) => {
                            const isUser = msg.role === "user"
                            return (
                                <div
                                    key={idx}
                                    className={`my-2 flex ${isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`rounded-md px-4 py-2 text-sm max-w-[75%] whitespace-pre-wrap ${
                                            isUser
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

                {/* Fixed input bar */}
                <div className="fixed bottom-0 left-0 right-0 border-t bg-white py-3 px-4">
                    <div className="mx-auto flex w-full max-w-xl items-center gap-2">
                        <Input
                            placeholder="Send a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSend()
                            }}
                            className="flex-1"
                        />
                        <Button onClick={handleSend}>
                            <SendIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
