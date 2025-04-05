"use client";

import { useRef, useState, DragEvent } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
    Settings as SettingsIcon,
    CloudUploadIcon,
    FileUpIcon,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SettingsPanelProps {
    onAnalysisDone: (
        clusters: unknown,
        manifest: unknown,
        xai: unknown,
        labels: Record<string, string>
    ) => void;
    setIsLoading: (value: boolean) => void
    isLoading: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function SettingsPanel({ onAnalysisDone, setIsLoading, isLoading}: SettingsPanelProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [algo, setAlgo] = useState<"kmeans" | "agglomerative" | "dbscan" | "auto">(
        "kmeans"
    );
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // K-Means settings
    const [clusterCount, setClusterCount] = useState(3);
    const [maxIter, setMaxIter] = useState(300);

    // Agglomerative settings
    const [linkage, setLinkage] = useState<"single" | "complete" | "average">(
        "single"
    );

    // DBSCAN settings
    const [epsilon, setEpsilon] = useState(0.5);
    const [minSamples, setMinSamples] = useState(5);

    // Common settings
    const [projectName, setProjectName] = useState("");
    const [generateReport] = useState(false);

    const handleNext = () => setCurrentStep((prev) => prev + 1);
    const handleBack = () => setCurrentStep((prev) => prev - 1);

    function buildParams() {
        switch (algo) {
            case "kmeans":
                return { clusterCount, maxIter };
            case "agglomerative":
                return { linkage };
            case "dbscan":
                return { epsilon, minSamples };
            default:
                return {}; // auto
        }
    }

    const startAnalysis = async () => {
        // 1) Controlli di base
        if (!files.length || !projectName) {
            alert("Please upload a file and enter a project name.");
            return;
        }
        setIsLoading(true);

        try {
            // 2) Recupera utente
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            if (error || !user) {
                console.error("Errore nel recupero utente:", error);
                alert("User not authenticated.");
                return;
            }

            // 3) Costruisci i parametri in base all'algoritmo
            const params = buildParams();

            // 4) Prepara FormData
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("user_id", user.id);
            formData.append("project_name", projectName);
            formData.append("algorithm", algo);
            formData.append("params", JSON.stringify(params));
            if (generateReport) {
                // Se vuoi mandare un flag, aggiungilo qui
                formData.append("generate_report", "true");
            }

            // 5) Chiamata API
            const response = await fetch(
                `${API_BASE}/clustering/clustering`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status}\n${errorText}`);
            }

            // 6) Leggi risposta
            const data = await response.json();
            console.log("✅ Clustering completato:", data);

            const { clusters, manifest, xai, labels } = data.frontend_data;
            // CHIAMA LA CALLBACK
            onAnalysisDone(clusters, manifest, xai, labels);

        } catch (err) {
            console.error("Errore durante l’analisi:", err);
            alert("Errore durante l’analisi.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle drop event and filter files
    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const acceptedExtensions = [".csv", ".xls", ".xlsx", ".txt"];
        const filteredFiles = droppedFiles.filter((file) =>
            acceptedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
        );

        if (filteredFiles.length) {
            console.log("Valid files dropped:", filteredFiles);
            setFiles(filteredFiles);
        } else {
            console.log("No valid files dropped!");
            setFiles([]);
        }
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }

    function handleDragLeave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        const acceptedExtensions = [".csv", ".xls", ".xlsx", ".txt"];
        const filteredFiles = selectedFiles.filter((file) =>
            acceptedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
        );

        if (filteredFiles.length) {
            console.log("Valid files selected:", filteredFiles);
            setFiles(filteredFiles);
        } else {
            console.log("No valid files selected!");
            setFiles([]);
        }
        e.target.value = "";
    }

    function triggerFileSelect() {
        fileInputRef.current?.click();
    }

    function resetState() {
        setCurrentStep(1);
        setAlgo("auto");
        setFiles([]);
        setClusterCount(3);
        setMaxIter(300);
        setLinkage("single");
        setEpsilon(0.5);
        setMinSamples(5);
        setProjectName("");
    }

    return (
        <>
            {/* UPLOAD SECTION */}
            <Card className="h-[350px] flex flex-col justify-between mr-5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CloudUploadIcon className="mr-2 h-5 w-5 text-blue-700" />
                        Upload Data
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 h-full">
                    <div
                        className={`w-full p-6 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
                            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                        }`}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                    >
                        <FileUpIcon className="h-12 w-12 text-gray-500 mx-auto" />
                        <p className="text-center text-sm text-muted-foreground mt-2">
                            Drag & Drop your file here.
                        </p>
                        <p className="text-center text-xs text-muted-foreground">
                            (Accepted format: Series Matrix File TXT)
                        </p>
                        <input
                            type="file"
                            multiple
                            accept=".txt"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                                try {
                                    const response = await fetch("/GSE8599_series_matrix.txt");
                                    const blob = await response.blob(); // <-- non usare .text()
                                    const file = new File([blob], "GSE8599_series_matrix.txt", {
                                        type: "text/plain",
                                        lastModified: new Date().getTime(),
                                    });
                                    console.log("Loaded example file:", file.name, file.size, file.type);
                                    setFiles([file]);
                                    setProjectName("Example GSE8599"); // Optional: auto-fill name
                                } catch (error) {
                                    alert("Failed to load example file.");
                                    console.error(error);
                                }
                            }}
                        >
                            Use Example File
                        </Button>
                        <Button size="sm" onClick={triggerFileSelect} className="cursor-pointer">
                            Select a file
                        </Button>
                    </div>

                    {files.length > 0 && (
                        <div className="w-full">
                            <p className="text-sm font-medium">Selected File:</p>
                            <ul className="list-disc ml-6">
                                {files.map((file, index) => (
                                    <li key={index} className="text-sm">
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* SETTINGS SECTION */}
            <Card className="h-[300px] flex flex-col justify-between mr-5 mt-7">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <SettingsIcon className="mr-2 h-5 w-5 text-blue-700" /> Analysis
                        Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 h-full">
                    <motion.div
                        className="flex flex-col gap-4 w-full"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Step 1: Choose algorithm */}
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
                                        <SelectValue placeholder="Select an algorithm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kmeans">K-Means</SelectItem>
                                        <SelectItem value="agglomerative">Agglomerative</SelectItem>
                                        <SelectItem value="dbscan">DBSCAN</SelectItem>
                                        {/* <SelectItem value="auto">MedAI takes care of it</SelectItem> */}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Step 2: Algorithm-specific settings */}
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
                                                onValueChange={([val]) => setClusterCount(val)}
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
                                                onValueChange={([val]) => setMaxIter(val)}
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
                                        <Label className="text-xs md:text-sm font-medium">
                                            Linkage Method:
                                        </Label>
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
                                            <Label
                                                htmlFor="epsilon-slider"
                                                className="text-xs md:text-sm font-medium"
                                            >
                                                Epsilon: {epsilon}
                                            </Label>
                                            <Slider
                                                id="epsilon-slider"
                                                value={[epsilon]}
                                                onValueChange={([val]) => setEpsilon(parseFloat(val.toFixed(1)))}
                                                min={0.1}
                                                max={10}
                                                step={0.1}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="min-samples"
                                                className="text-xs md:text-sm font-medium"
                                            >
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

                        {/* Step 2 for AI or Step 3 for manual settings: Project Name & PDF */}
                        {currentStep === (algo === "auto" ? 2 : 3) && (
                            <div className="w-full flex flex-col gap-4">
                                <div>
                                    <Label
                                        htmlFor="projectName"
                                        className="text-xs md:text-sm font-medium"
                                    >
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
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="w-full flex justify-between mt-4">
                            {currentStep > 1 && (
                                <Button variant="outline" onClick={handleBack} className="cursor-pointer">
                                    Back
                                </Button>
                            )}
                            <Button onClick={resetState} variant="outline" className="cursor-pointer ml-auto">Reset</Button>
                            {currentStep < (algo === "auto" ? 2 : 3) ? (
                                <Button onClick={handleNext} className="cursor-pointer ml-2">
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    onClick={startAnalysis}
                                    className="cursor-pointer bg-blue-700 hover:bg-blue-500 ml-2"
                                    disabled={isLoading}
                                >{isLoading ? "Analysing..." : "Start Analysis"}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </>
    );
}
