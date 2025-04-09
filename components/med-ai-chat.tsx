"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SparklesIcon } from "lucide-react";
import { AskMedAIView } from "@/components/ask-med-ai-view";

interface MedAiChatProps {
    open: boolean;
    onOpenChange: (val: boolean) => void;
    initialMessage?: string | null;
    manifest: unknown;
    clusters: unknown;
    xai: unknown;
    labels?: Record<string, string> | null;
}

export function MedAiChat({
                              open,
                              onOpenChange,
                              initialMessage,
                              manifest,
                              clusters,
                              xai,
                              labels,
                          }: MedAiChatProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[1200px] max-h-[90vh] w-full p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <SparklesIcon className="h-5 w-5 text-blue-700" />
                        Continue with MedAI
                    </DialogTitle>
                </DialogHeader>

                <div className="h-[75vh] overflow-hidden">
                    <AskMedAIView
                        initialMessages={
                            initialMessage
                                ? [
                                    {
                                        id: crypto.randomUUID(),
                                        role: "assistant",
                                        content: initialMessage,
                                    },
                                ]
                                : []
                        }
                        manifest={manifest}
                        clusters={clusters}
                        xai={xai}
                        labels={labels}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
