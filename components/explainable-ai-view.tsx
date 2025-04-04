"use client";

import { TextIcon, SparklesIcon, Copy } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area";

interface ExplainableAIPanelProps {
    isLoading: boolean;
    modelresponse: string | null;
}

export function ExplainableAIPanel({ isLoading, modelresponse }: ExplainableAIPanelProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!modelresponse) return;
        navigator.clipboard.writeText(modelresponse);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    if (isLoading && !modelresponse) {
        return (
            <Card className="h-auto flex flex-col justify-between ml-5 mt-5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <SparklesIcon className="mr-2 h-5 w-5 text-blue-700" />
                        What MedAI has to say:
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 h-full">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                </CardContent>
            </Card>
        );
    }

    if (!modelresponse) {
        return (
            <Card className="h-auto flex flex-col justify-between ml-5 mt-5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <a
                            href="https://www.ibm.com/think/topics/explainable-ai#:~:text=Explainable%20artificial%20intelligence%20(XAI)%20is,expected%20impact%20and%20potential%20biases."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <SparklesIcon className="mr-2 h-5 w-5 text-blue-700 hover:text-zinc-900" />
                        </a>
                        What MedAI has to say:
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 h-full">
                    <Card className="bg-zinc-50 rounded-md shadow-sm w-full h-[70px]">
                        <CardContent className="h-full flex items-center justify-center">
                            <TextIcon className="h-6 w-6 text-gray-500" />
                            <p className="ml-2 text-sm text-muted-foreground">
                                Text-based insights on your analyzed data
                            </p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        );
    }

    // ✅ Data present → show insights
    return (
        <Card className="h-auto flex flex-col justify-between ml-5 mt-5">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <SparklesIcon className="mr-2 h-5 w-5 text-blue-700" />
                    What MedAI has to say:
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-start justify-center px-4 gap-2 h-full">
                <Card className="bg-zinc-50 rounded-md shadow-sm w-full relative max-h-[200px]">
                    {/* 📋 Copy Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-black"
                        onClick={handleCopy}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>

                    {/* 🧠 Scrollable Text */}
                    <CardContent className="h-full px-2 pt-4 pb-2">
                        <ScrollArea className="h-[150px] w-full pr-2">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {modelresponse}
                            </p>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* ✅ Copied feedback */}
                {copied && (
                    <span className="text-xs text-green-600 animate-pulse ml-1 mt-1">
                        Copied to clipboard!
                    </span>
                )}
            </CardContent>
        </Card>
    );
}
