"use client"

import * as React from "react"
import { SendIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Mock AI Responses
const mockMessages = [
    { sender: "ai", text: "Hello! How can I assist you today?" },
    { sender: "user", text: "How many clusters should I use?" },
    { sender: "ai", text: "Based on best practices, try K=5 for your dataset." }
]

export function AskMedAIView() {
    const [messages, setMessages] = React.useState(mockMessages)
    const [input, setInput] = React.useState("")

    const sendMessage = () => {
        if (!input.trim()) return
        setMessages([...messages, { sender: "user", text: input }])
        setInput("")
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-blue-500" />
                Ask Med.ai
            </h2>

            <Card className="h-80 overflow-y-auto p-4">
                <CardContent className="space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}>
                            <div className={`rounded-lg p-3 ${msg.sender === "ai" ? "bg-gray-200 text-black" : "bg-blue-500 text-white"}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Input
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={sendMessage}>
                    <SendIcon className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
