"use client";

import { motion } from "framer-motion";

export function ExplainableAIPanel() {
    return (
        <motion.div
            className="flex flex-col h-full bg-gray-50 m-4 p-4 rounded-md shadow-sm"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-sm md:text-base font-semibold mb-2">Explainable AI</h3>
            <div className="flex-1 border rounded-md bg-white flex items-center justify-center">
                <p className="text-gray-400 text-sm">[Feature importances, SHAP, LIME, etc.]</p>
            </div>
        </motion.div>
    );
}
