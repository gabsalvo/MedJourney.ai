"use client";

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
} from "recharts";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { InfoIcon, ClipboardCopyIcon, ChevronDown } from "lucide-react";
import { buildLabel } from "@/lib/buildLabel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type ClusterPoint = {
    x: number;
    y: number;
    cluster: number;
    sample_id?: string;
    label?: string;
    metadata?: Record<string, string>;
    [key: string]: any;
};

interface ClusteringChartProps {
    points: ClusterPoint[];
}

const COLOR_PALETTE = [
    "#1d4ed8", "#16a34a", "#b91c1c", "#ca8a04", "#6b21a8", "#0e7490",
    "#be123c", "#7c3aed", "#065f46", "#ea580c", "#0284c7", "#a21caf",
    "#15803d", "#f59e0b", "#d946ef", "#3b82f6", "#10b981", "#f43f5e",
    "#9333ea", "#f97316", "#14b8a6", "#e11d48", "#7e22ce", "#22d3ee",
    "#facc15", "#4b5563", "#7f1d1d", "#991b1b", "#a16207", "#4c1d95",
    "#0f766e", "#0ea5e9", "#3f6212", "#f87171", "#6b7280", "#0891b2",
    "#7dd3fc", "#6366f1", "#84cc16", "#8b5cf6", "#fcd34d", "#d4d4d4"
];

export function ClusteringChart({ points }: ClusteringChartProps) {
    const [expanded, setExpanded] = useState(false);
    const [metadataKey, setMetadataKey] = useState<string | null>(null);

    if (points.length === 0) return null;

    const grouped = points.reduce((acc, point) => {
        const key = `cluster${point.cluster}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(point);
        return acc;
    }, {} as Record<string, ClusterPoint[]>);

    const chartConfig = Object.keys(grouped).reduce((acc, key, i) => {
        acc[key] = {
            label: `Cluster ${key.replace("cluster", "")}`,
            color: COLOR_PALETTE[i % COLOR_PALETTE.length],
        };
        return acc;
    }, {} as Record<string, { label: string; color: string }>);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload?.length) {
            const data = payload[0].payload as ClusterPoint;
            const metadataEntries = data.metadata ? Object.entries(data.metadata) : [];
            const visibleEntries = expanded ? metadataEntries : metadataEntries.slice(0, 4);

            return (
                <div className="bg-white shadow-lg p-3 rounded-md border text-xs space-y-1 max-w-xs">
                    <div className="flex items-center justify-between">
                        <strong>Sample:</strong>
                        <span>{data.sample_id ?? "N/A"}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-4 w-4"
                            onClick={() => navigator.clipboard.writeText(data.sample_id || "")}
                        >
                            <ClipboardCopyIcon className="h-3 w-3" />
                        </Button>
                    </div>
                    <div><strong>Label:</strong> {data.label ?? buildLabel(data.metadata ?? {})}</div>
                    <div><strong>Cluster:</strong> {data.cluster}</div>
                    <div><strong>PC1:</strong> {data.x.toFixed(2)}</div>
                    <div><strong>PC2:</strong> {data.y.toFixed(2)}</div>
                    {metadataEntries.length > 0 && (
                        <div className="mt-1 text-muted-foreground">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Metadata:</span>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-xs px-1"
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    {expanded ? "Show less" : "Show more"}
                                </Button>
                            </div>
                            {visibleEntries.map(([k, v]) => (
                                <div key={k}><strong>{k}:</strong> {v}</div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center justify-between px-2">
                <Tooltip>
                    <TooltipTrigger className="flex items-center text-muted-foreground text-xs cursor-help">
                        <InfoIcon className="w-3 h-3 mr-1" />
                        PCA Projection
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm text-xs">
                        PCA (Principal Component Analysis) reduces complex high-dimensional data into 2D while preserving the most variance. Each dot is a sample, color-coded by its cluster.
                    </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                            Filter by metadata {metadataKey && `: ${metadataKey}`} <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {Object.keys(points[0]?.metadata || {}).map((key) => (
                            <DropdownMenuItem key={key} onClick={() => setMetadataKey(key)}>
                                {key}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => setMetadataKey(null)}>
                            Reset filter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ChartContainer config={chartConfig} className="min-h-[320px] w-full">
                <ResponsiveContainer width="100%" height={320}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="x"
                            name="PC1"
                            label={{ value: "PC1", position: "insideBottom", offset: -5 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            dataKey="y"
                            name="PC2"
                            label={{ value: "PC2", angle: -90, position: "insideLeft" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <ChartLegend content={<ChartLegendContent nameKey="cluster" />} />
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