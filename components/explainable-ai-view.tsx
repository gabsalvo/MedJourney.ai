"use client";

import { TextIcon, SparklesIcon, Copy, BookDashed, Download } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // assicurati sia importato



interface ExplainableAIPanelProps {
    isLoading: boolean;
    modelresponse: string | null;
    setModelresponse: (val: string | null) => void;
    onStartChat: () => void; // ✅ aggiunto
}

export function ExplainableAIPanel({ isLoading, modelresponse, setModelresponse, onStartChat }: ExplainableAIPanelProps) {
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
                <Card className="bg-zinc-50 rounded-md shadow-sm w-full relative ">
                    {/* 📋 Copy Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-black cursor pointer"
                                onClick={handleCopy}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                            {copied ? "Copied!" : "Copy to clipboard"}
                        </TooltipContent>
                    </Tooltip>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-10 h-6 w-6 text-gray-500 hover:text-black cursor pointer"
                        onClick={() => {
                            if (!modelresponse) return;
                            const blob = new Blob([modelresponse], { type: "text/markdown" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "medai_analysis.md";
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-24 h-6 w-6 text-gray-500 hover:text-black cursor pointer"
                        onClick={() => setModelresponse(null)}
                    >
                     <BookDashed className="h-4 w-4" /> Clear
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-48 h-6 w-6 text-blue-700 hover:text-blue-500 cursor pointer"
                        onClick={onStartChat}
                    >
                        <SparklesIcon className="h-4 w-4" /> Ask MedAI
                    </Button>
                    {/* 🧠 Scrollable Text */}
                    <CardContent className="h-full px-2 pt-4 pb-2">
                        <ScrollArea className="max-h-[400px] w-full pr-2 rounded-md border bg-white overflow-y-auto">
                        <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-200 px-4 py-2">
                                <ReactMarkdown
                                    components={{
                                        h1: (props) => <h1 className="text-xl font-bold mt-4 mb-2 text-zinc-800" {...props} />,
                                        h2: (props) => <h2 className="text-lg font-semibold mt-4 mb-2 text-zinc-700" {...props} />,
                                        p: (props) => <p className="mb-2 leading-relaxed" {...props} />,
                                        ul: (props) => <ul className="list-disc ml-5 mb-2" {...props} />,
                                        ol: (props) => <ol className="list-decimal ml-5 mb-2" {...props} />,
                                        li: (props) => <li className="mb-1" {...props} />,
                                        strong: (props) => <strong className="font-semibold text-black" {...props} />,
                                        em: (props) => <em className="italic text-zinc-600" {...props} />,
                                        code: (props) => <code className="bg-zinc-100 px-1 py-0.5 rounded text-sm" {...props} />,
                                    }}
                                >
                                    {modelresponse || ""}
                                </ReactMarkdown>
                            </div>
                        </ScrollArea>
                    </CardContent>

                </Card>
            </CardContent>
        </Card>
    );
}
