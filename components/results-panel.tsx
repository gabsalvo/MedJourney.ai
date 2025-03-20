// ResultsPanel.tsx (Displays AI Clustering Results in an Interactive Chart)
"use client";

import { useState } from "react";
import { LineChart } from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export function ResultsPanel() {
    const [data] = useState([ // Mock Data
        { x: "Cluster A", y: 30 },
        { x: "Cluster B", y: 50 },
        { x: "Cluster C", y: 20 },
    ]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>📊 Clustering Results</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
                <LineChart data={data} />
            </CardContent>
        </Card>
    );
}