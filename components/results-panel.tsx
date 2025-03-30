"use client";

import {BoxesIcon, ChartAreaIcon} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {ClusteringChart} from "@/components/ClusteringCharts";


interface ResultsPanelProps {
    clusters: unknown;
    manifest: unknown;
    isLoading: boolean;
}

type ClusterPoint = {
    [key: string]: number | string;
    cluster: number;
};
function isValidClusterData(data: unknown): data is { points: ClusterPoint[] } {
    return (
        typeof data === "object" &&
        data !== null &&
        Object.prototype.hasOwnProperty.call(data, "points") &&
        Array.isArray((data as { points: unknown }).points)
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ResultsPanel({ clusters, manifest, isLoading }: ResultsPanelProps) {
    if (isLoading) {
        return (
            <Card className="h-[450px] flex flex-col ml-5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BoxesIcon className="mr-2 h-5 w-5 text-blue-700" />
                        Clustering Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center flex-grow">
                    <Card className="bg-zinc-50 rounded-md shadow-sm w-full h-[350px]">
                        <CardContent className="flex flex-col gap-2 items-center justify-center h-full">
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-44 w-5/6" />
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        );
    }
    // 2. Se non abbiamo clusters => Placeholder
    if (!clusters) {
        return (
            <Card className="h-[450px] flex flex-col ml-5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BoxesIcon className="mr-2 h-5 w-5 text-blue-700" />
                        Clustering Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center flex-grow">
                    <Card className="bg-zinc-50 rounded-md shadow-sm w-full h-[350px]">
                        <CardContent>
                            <div className="w-full justify-center items-center p-25">
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

    // 3. Altrimenti => abbiamo i dati, mostriamo i grafici (o tabella, etc.)
    if (isValidClusterData(clusters)) {
        return (
            <Card className="h-auto flex flex-col ml-5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BoxesIcon className="mr-2 h-5 w-5 text-blue-700" />
                        Clustering Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center flex-grow">
                    <ClusteringChart points={clusters.points} />
                </CardContent>
            </Card>
        );
    }
}
