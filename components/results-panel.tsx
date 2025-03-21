"use client";

import {BoxesIcon, ChartAreaIcon} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";

export function ResultsPanel() {
    return (
        <Card className="h-[450px] flex flex-col ml-5">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <BoxesIcon className="mr-2 h-5 w-5 text-blue-700" />
                    Clustering Results
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center flex-grow">
                {/* Inner card as the results container */}
                <Card className="bg-zinc-50 rounded-md shadow-sm w-full h-[350px]">
                    <CardContent>
                        <div
                            className="w-full justify-center items-center p-25"
                        >
                            <ChartAreaIcon className="h-12 w-12 text-gray-500 mx-auto" />
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                Your Clustering Results will be displayed here
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}
