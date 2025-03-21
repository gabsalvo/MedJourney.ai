"use client";

import { TextIcon, InfoIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";

export function ExplainableAIPanel() {
    return (
        <Card className="h-[175px] flex flex-col justify-between ml-5 mt-5">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <a
                        href="https://www.ibm.com/think/topics/explainable-ai#:~:text=Explainable%20artificial%20intelligence%20(XAI)%20is,expected%20impact%20and%20potential%20biases."
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <InfoIcon className="mr-2 h-5 w-5 text-blue-700 hover:text-zinc-900" />
                    </a>
                    Explainable AI
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 h-full">
                <Card className="bg-zinc-50 rounded-md shadow-sm w-full h-[70px]">
                    {/* Make the CardContent fill the card’s height, then center children with flex */}
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
