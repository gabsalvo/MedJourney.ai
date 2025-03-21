"use client"

import { useState } from "react"
import { useChat, type UseChatOptions } from "@ai-sdk/react"

import { cn } from "@/lib/utils"
import { Chat } from "@/components/ui/chat"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const MODELS = [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
    { id: "deepseek-r1-distill-llama-70b", name: "Deepseek R1 70B" },
]

type ChatDemoProps = {
    initialMessages?: UseChatOptions["initialMessages"]
}

export function AskMedAIView(props: ChatDemoProps) {
    const [selectedModel, setSelectedModel] = useState(MODELS[0].id)

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        append,
        stop,
        isLoading,
        setMessages,
    } = useChat({
        ...props,
        api: "/api/chat",
        body: {
            model: selectedModel,
        },
    })

    return (
        <div className={cn("flex", "flex-col", "h-full", "w-full", "px-96", "overflow-x-hidden")}>
            <div className={cn("flex", "justify-end", "mb-2")}>
                <Select value={selectedModel} onValueChange={setSelectedModel} >
                    <SelectTrigger className="w-[180px], cursor-pointer">
                        <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                        {MODELS.map((model) => (
                            <SelectItem key={model.id} value={model.id} className="cursor-pointer">
                                {model.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Chat
                className="grow"
                // @ts-expect-error no worries
                messages={messages}
                handleSubmit={handleSubmit}
                input={input}
                handleInputChange={handleInputChange}
                isGenerating={isLoading}
                stop={stop}
                append={append}
                setMessages={setMessages}
                suggestions={[
                    "How can clustering be used to identify patterns in medical data?",
                    "Explain the difference between K-Means, DBSCAN, and Agglomerative Clustering.",
                    "How does Explainable AI (XAI) improve trust in medical AI models?"
                ]}
            />
        </div>
    )
}