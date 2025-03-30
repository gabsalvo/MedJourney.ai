"use client";

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

type ClusterPoint = {
    [key: string]: number | string;
    cluster: number;
};

interface ClusteringChartProps {
    points: ClusterPoint[];
}

export function ClusteringChart({ points }: ClusteringChartProps) {
    if (points.length === 0) return null;

    const xKey = "x";
    const yKey = "y";

    // Group points by cluster
    const grouped = points.reduce((acc, point) => {
        const clusterKey = `cluster${point.cluster}`;
        if (!acc[clusterKey]) acc[clusterKey] = [];
        acc[clusterKey].push(point);
        return acc;
    }, {} as Record<string, ClusterPoint[]>);

    // Tailwind-inspired HEX colors
    const tailwindHexColors = [
        "#1d4ed8", // blue-700
        "#16a34a", // green-600
        "#b91c1c", // red-700
        "#ca8a04", // yellow-600
        "#6b21a8", // purple-700
    ];

    const chartConfig = Object.keys(grouped).reduce((acc, key, i) => {
        acc[key] = {
            label: `Cluster ${key.replace("cluster", "")}`,
            color: tailwindHexColors[i % tailwindHexColors.length],
        };
        return acc;
    }, {} as Record<string, { label: string; color: string }>);

    return (
        <div className="w-full space-y-3">
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={xKey}
                            name="Component 1"
                            label={{ value: "Component 1", position: "insideBottom", offset: -5 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            dataKey={yKey}
                            name="Component 2"
                            label={{ value: "Component 2", angle: -90, position: "insideLeft" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelKey="cluster"
                                    nameKey="cluster"
                                />
                            }
                        />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="cluster" />}
                        />
                        {Object.entries(grouped).map(([key, data]) => (
                            <Scatter
                                key={key}
                                name={chartConfig[key].label}
                                data={data}
                                fill={chartConfig[key].color}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}
