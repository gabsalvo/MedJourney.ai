"use client"

import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
} from "recharts"
import {
    ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent
} from "@/components/ui/chart"

type ClusterPoint = {
    [key: string]: number | string
    cluster: number
}

interface ClusteringChartProps {
    points: ClusterPoint[]
}

export function ClusteringChart({ points }: ClusteringChartProps) {
    if (points.length === 0) return null

    // 1. Identifica le dimensioni numeriche (escludi 'cluster')
    const numericKeys = Object.keys(points[0]).filter(
        key => key !== "cluster" && typeof points[0][key] === "number"
    )

    if (numericKeys.length < 2) {
        return <p className="text-sm text-muted-foreground">Not enough dimensions to display a scatter plot.</p>
    }

    const [xKey, yKey] = numericKeys

    // 2. Raggruppa i punti per cluster
    const grouped = points.reduce((acc, point) => {
        const key = `cluster${point.cluster}`
        if (!acc[key]) acc[key] = []
        acc[key].push(point)
        return acc
    }, {} as Record<string, ClusterPoint[]>)

    // 3. Crea la config colori dinamica
    const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))"
    ]
    const chartConfig = Object.keys(grouped).reduce((acc, key, i) => {
        acc[key] = {
            label: `Cluster ${key.replace("cluster", "")}`,
            color: colors[i % colors.length]
        }
        return acc
    }, {} as Record<string, { label: string; color: string }>)

    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ScatterChart>
                <CartesianGrid />
                <XAxis dataKey={xKey} name={xKey} />
                <YAxis dataKey={yKey} name={yKey} />
                <ChartTooltip content={<ChartTooltipContent />} />
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
        </ChartContainer>
    )
}
