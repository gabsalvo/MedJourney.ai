"use client";

import { SetStateAction, useState } from "react";
import {motion} from "framer-motion";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Slider} from "@/components/ui/slider";
import {Settings as SettingsIcon} from "lucide-react";

// Define base settings interface
type AnalysisSettingsBase = {
    algorithm: "auto" | "kmeans" | "agglomerative" | "dbscan";
    projectName: string;
    generateReport: boolean;
};

interface KMeansSettings extends AnalysisSettingsBase {
    algorithm: "kmeans";
    clusterCount: number;
    maxIter: number;
}

interface AgglomerativeSettings extends AnalysisSettingsBase {
    algorithm: "agglomerative";
    linkage: "single" | "complete" | "average";
}

interface DBSCANSettings extends AnalysisSettingsBase {
    algorithm: "dbscan";
    epsilon: number;
    minSamples: number;
}

interface AutoSettings extends AnalysisSettingsBase {
    algorithm: "auto";
}

type AnalysisSettings = KMeansSettings | AgglomerativeSettings | DBSCANSettings | AutoSettings;

export function SettingsPanel() {
    const [currentStep, setCurrentStep] = useState(1);
    const [algo, setAlgo] = useState<"kmeans" | "agglomerative" | "dbscan" | "auto">("auto");

    // K-Means settings
    const [clusterCount, setClusterCount] = useState(3);
    const [maxIter, setMaxIter] = useState(300);

    // Agglomerative settings
    const [linkage, setLinkage] = useState<"single" | "complete" | "average">("single");

    // DBSCAN settings
    const [epsilon, setEpsilon] = useState(0.5);
    const [minSamples, setMinSamples] = useState(5);

    // Common settings
    const [projectName, setProjectName] = useState("");
    const [generateReport] = useState(false);

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const startAnalysis = () => {
        let analysisSettings: AnalysisSettings;
        if (algo === "kmeans") {
            analysisSettings = {
                algorithm: "kmeans",
                projectName,
                generateReport,
                clusterCount,
                maxIter,
            };
        } else if (algo === "agglomerative") {
            analysisSettings = {
                algorithm: "agglomerative",
                projectName,
                generateReport,
                linkage,
            };
        } else if (algo === "dbscan") {
            analysisSettings = {
                algorithm: "dbscan",
                projectName,
                generateReport,
                epsilon,
                minSamples,
            };
        } else {
            analysisSettings = {
                algorithm: "auto",
                projectName,
                generateReport,
            };
        }

        console.log("Start Analysis with:", analysisSettings);
        // Trigger your backend API or clustering logic here
    };

    return (
        <Card className="h-[300px] flex flex-col justify-between mr-5 ">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <SettingsIcon className="mr-2 h-5 w-5 text-blue-700"/> Analysis Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 h-full">
                <motion.div
                    className="flex flex-col gap-4 w-full"
                    initial={{y: 10, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.3}}
                >
                    {/* Step 1: Choose algorithm using a Select combobox */}
                    {currentStep === 1 && (
                        <div className="w-full">
                            <Label htmlFor="algo-select" className="mb-2 text-sm font-bold">
                                Choose a clustering algorithm:
                            </Label>
                            <Select
                                value={algo}
                                onValueChange={(value) =>
                                    setAlgo(value as "kmeans" | "agglomerative" | "dbscan" | "auto")
                                }
                            >
                                <SelectTrigger id="algo-select" className="w-full cursor-pointer">
                                    <SelectValue placeholder="Select an algorithm"/>
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="kmeans" className="cursor-pointer">K-Means</SelectItem>
                                    <SelectItem value="agglomerative" className="cursor-pointer">Agglomerative</SelectItem>
                                    <SelectItem value="dbscan" className="cursor-pointer">DBSCAN</SelectItem>
                                    <SelectItem value="auto" className="cursor-pointer">Let AI choose for me</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Step 2: Algorithm-specific settings (if not AI) */}
                    {currentStep === 2 && algo !== "auto" && (
                        <>
                            {algo === "kmeans" && (
                                <div className="w-full flex flex-col gap-4">
                                    <div>
                                        <Label htmlFor="cluster-slider" className="text-xs md:text-sm font-medium">
                                            Number of Clusters: {clusterCount}
                                        </Label>
                                        <Slider
                                            id="cluster-slider"
                                            value={[clusterCount]}
                                            onValueChange={(value: SetStateAction<number>[]) => setClusterCount(value[0])}
                                            min={2}
                                            max={20}
                                            step={1}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="iter-slider" className="text-xs md:text-sm font-medium">
                                            Max Iterations: {maxIter}
                                        </Label>
                                        <Slider
                                            id="iter-slider"
                                            value={[maxIter]}
                                            onValueChange={(value: SetStateAction<number>[]) => setMaxIter(value[0])}
                                            min={100}
                                            max={1000}
                                            step={50}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            )}
                            {algo === "agglomerative" && (
                                <div className="w-full flex flex-col gap-2">
                                    <Label className="text-xs md:text-sm font-medium">Linkage Method:</Label>
                                    <Select
                                        value={linkage}
                                        onValueChange={(value) =>
                                            setLinkage(value as "single" | "complete" | "average")
                                        }
                                    >
                                        <SelectTrigger className="w-full mt-1">
                                            <SelectValue placeholder="Select linkage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="complete">Complete</SelectItem>
                                            <SelectItem value="average">Average</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {algo === "dbscan" && (
                                <div className="w-full flex flex-col gap-4">
                                    <div>
                                        <Label htmlFor="epsilon-slider" className="text-xs md:text-sm font-medium">
                                            Epsilon: {epsilon}
                                        </Label>
                                        <Slider
                                            id="epsilon-slider"
                                            value={[epsilon]}
                                            onValueChange={(value: number[]) => setEpsilon(parseFloat(value[0].toFixed(1)))}
                                            min={0.1}
                                            max={10}
                                            step={0.1}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="min-samples" className="text-xs md:text-sm font-medium">
                                            Min Samples: {minSamples}
                                        </Label>
                                        <Input
                                            id="min-samples"
                                            type="number"
                                            value={minSamples.toString()}
                                            onChange={(e) => setMinSamples(Number(e.target.value))}
                                            className="w-full mt-1"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Step 2 for AI or Step 3 for manual settings: Project Name & Report Toggle */}
                    {currentStep === (algo === "auto" ? 2 : 3) && (
                        <div className="w-full flex flex-col gap-4">
                            <div>
                                <Label htmlFor="projectName" className="text-xs md:text-sm font-medium">
                                    Project Name
                                </Label>
                                <Input
                                    id="projectName"
                                    type="text"
                                    placeholder="Enter project name"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full mt-1"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="report"
                                    className="cursor-pointer border-zinc-950"
                                />
                                <Label htmlFor="report" className="cursor-pointer text-sm font-medium">
                                    Generate a PDF Report
                                </Label>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="w-full flex justify-between mt-4">
                        {currentStep > 1 && (
                            <Button variant="outline" onClick={handleBack} className="cursor-pointer">
                                Back
                            </Button>
                        )}
                        {currentStep < (algo === "auto" ? 2 : 3) ? (
                            <Button onClick={handleNext} className="cursor-pointer">Next</Button>
                        ) : (
                            <Button onClick={startAnalysis} className="cursor-pointer bg-blue-700 hover:bg-blue-500">Start Analysis</Button>
                        )}
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );
}
