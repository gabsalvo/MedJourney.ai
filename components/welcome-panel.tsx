"use client";

import { motion } from "framer-motion";

/**
 * Top fixed panel
 * Minimal text and subtle animation, remove if you don't need it.
 */
export function WelcomePanel() {
    return (
        <div className="w-full h-full bg-transparent flex items-center justify-center p-4">
            <motion.h1
                className="text-black text-lg font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                Welcome to MedJourney.ai
            </motion.h1>
        </div>
    );
}
