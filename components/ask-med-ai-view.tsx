"use client";

import { useState } from "react";
import { Chat } from "@/components/ui/chat";
import { v4 as uuidv4 } from "uuid";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type AskMedAIViewProps = {
    initialMessages?: { id: string; role: "user" | "assistant"; content: string }[];
    manifest: unknown;
    clusters: unknown;
    xai: unknown;
    labels?: Record<string, string> | null;
};

export function AskMedAIView({
                                 initialMessages = [],
                                 manifest,
                                 clusters,
                                 xai,
                                 labels,
                             }: AskMedAIViewProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInput(e.target.value);
    };


    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault(); // 👈 qui risolvi tutto

        if (!input.trim()) return;

        const userMessage = {
            id: uuidv4(),
            role: "user" as const,
            content: input,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map(({ role, content }) => ({ role, content })),
                    manifest,
                    clusters,
                    xai,
                    labels,
                }),
            });

            const data = await res.json();

            const assistantMessage = {
                id: uuidv4(),
                role: "assistant" as const,
                content: data.content || "🤖 MedAI responded, but gave no message.",
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: uuidv4(),
                    role: "assistant",
                    content: "❌ Error while contacting MedAI.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };


    const stop = () => {
        // Optional: logic to cancel fetch
    };

    const append = (msg: { role: "user" | "assistant"; content: string }) => {
        setMessages((prev) => [...prev, { ...msg, id: uuidv4() }]);
    };



    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <Chat
                    className="w-full h-full"
                    messages={messages}
                    // @ts-expect-error funziona lo stesso
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
                        "How does Explainable AI (XAI) improve trust in medical AI models?",
                    ]}
                />
            </div>
        </div>
    );
}
