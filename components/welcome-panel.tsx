"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { PartyPopperIcon } from "lucide-react";

const NUM_PARTICLES = 30;

type Particle = {
    id: number;
    scatterX: number;
    scatterY: number;
    clusterX: number;
    clusterY: number;
    color: string;
};

export function WelcomePanel() {
    // Generate particle data only once per mount.
    const particles: Particle[] = useMemo(() => {
        return Array.from({ length: NUM_PARTICLES }, (_, i) => {
            // Scatter coordinates: random between -150 and 150 px.
            const scatterX = Math.random() * 300 - 150;
            const scatterY = Math.random() * 300 - 150;
            // Cluster coordinates: random between -20 and 20 px.
            const clusterX = Math.random() * 40 - 20;
            const clusterY = Math.random() * 40 - 20;
            // Randomly choose between blue-600 and zinc-900.
            const color = Math.random() < 0.5 ? "bg-blue-600" : "bg-zinc-900";
            return { id: i, scatterX, scatterY, clusterX, clusterY, color };
        });
    }, []);

    return (
        <Card className="h-auto relative overflow-hidden bg-transparen">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <PartyPopperIcon className="mr-2 h-5 w-5" /> Welcome
                </CardTitle>
            </CardHeader>
            <CardContent className="justify-center h-full">
                {/* Particles container */}
                <div className="absolute inset-0">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className={`absolute rounded-full ${p.color}`}
                            style={{ width: 8, height: 8, top: "50%", left: "50%" }}
                            animate={{
                                // Animate from scattered to clustered and back.
                                x: [p.scatterX, p.clusterX, p.scatterX],
                                y: [p.scatterY, p.clusterY, p.scatterY],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
                {/* Centered welcome message */}
            </CardContent>
        </Card>
    );
}
