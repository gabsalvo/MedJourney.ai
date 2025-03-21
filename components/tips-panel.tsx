"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TestTubeDiagonalIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function TipsPanel() {
    const tips = useMemo(
        () =>[
        "Clustering helps group similar data—think of it like organizing patient records into understandable groups.",
        "A good clustering algorithm turns complex data into clear patterns, simplifying decision-making.",
        "Remember, the goal is to reveal hidden structures in your data, not just to crunch numbers.",
        "Sometimes simple algorithms work best—start basic and then fine-tune for clearer insights.",
        "Experiment with different settings to find the clustering that best fits your dataset."
    ], []);

    // Use a tipKey that increments on every update so AnimatePresence can detect changes.
    const [tipKey, setTipKey] = useState(0);
    const [currentTip, setCurrentTip] = useState(tips[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTipKey((prevKey) => {
                const newKey = prevKey + 1;
                setCurrentTip(tips[newKey % tips.length]);
                return newKey;
            });
        }, 10000); // update tip every 5 seconds
        return () => clearInterval(interval);
    }, [tips]);

    const variants = {
        initial: { opacity: 0, filter: "blur(4px)" },
        animate: { opacity: 1, filter: "blur(0px)" },
        exit: { opacity: 0, filter: "blur(4px)", transition: { duration: 0.3 } }
    };

    return (
        <Card className="h-auto relative overflow-hidden bg-transparent">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <TestTubeDiagonalIcon className="mr-2 h-5 w-5 text-blue-700" />
                    The Expert Tips
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center mt-[-40px]">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={tipKey}
                        className="text-center italic text-base text-zinc-600 "
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.8 }}
                    >
                        {`“${currentTip}”`}
                    </motion.p>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
