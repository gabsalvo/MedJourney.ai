"use client";

import { motion } from "framer-motion";

export function WelcomePanel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-center"
        >
            <h1 className="text-3xl font-bold">Welcome to MedJourney.ai</h1>
            <p className="text-muted-foreground text-lg">Unlock insights with AI-powered clustering</p>
        </motion.div>
    );
}