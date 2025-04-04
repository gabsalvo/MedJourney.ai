"use client";

import { useState, useEffect, DragEvent } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
}
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function QuickCreateDialog({ open, onOpenChange }: UploadDialogProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [project, setProject] = useState("");
    const [algorithm, setAlgorithm] = useState("kmeans");
    const [dragActive, setDragActive] = useState(false);
    const [downloadLink, setDownloadLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Get the authenticated user ID
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUserId(data.user.id);
            } else {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragActive(true);
    }

    function handleDragLeave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragActive(false);
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragActive(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        setFiles(Array.from(e.target.files));
    }

    async function handleAnalyse() {
        if (!userId || files.length === 0 || !project) return;

        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("user_id", userId);
        formData.append("project_name", project);
        formData.append("algorithm", algorithm);
        formData.append("params", JSON.stringify({}));

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/clustering/clustering`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data?.report_zip_path) {
                setDownloadLink(
                    `${API_BASE}/download-proxy?user_id=${data.user_id}&project_name=${data.project_name}`
                );
            }
        } catch (err) {
            console.error("Errore durante l'analisi:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Get New Insights on your Data</DialogTitle>
                    <DialogDescription>
                        Upload Your Data Set, Create a New Project and Get Your Clustering Analysis
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Upload your Files (CSV, Excel, or TXT):
                        </p>
                        <div
                            className={`mt-2 p-6 border-2 border-dashed rounded-md transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <p className="text-center text-sm text-muted-foreground">
                                Drag & Drop your file here.
                            </p>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <Button asChild>
                                <label>
                                    Select a file
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        accept=".csv,.xls,.xlsx,.txt"
                                        hidden
                                    />
                                </label>
                            </Button>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-medium">Selected File:</p>
                                <p className="text-sm">{files[0].name}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="mb-2 block text-sm font-semibold">Project Name</Label>
                            <Input
                                placeholder="Breast cancer clustering..."
                                value={project}
                                onChange={(e) => setProject(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-semibold">Algorithm</Label>
                            <Select value={algorithm} onValueChange={(val) => setAlgorithm(val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose algorithm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kmeans">K-Means</SelectItem>
                                    <SelectItem value="agglomerative">Agglomerative</SelectItem>
                                    <SelectItem value="dbscan">DBSCAN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleAnalyse} disabled={loading || !userId}>
                        {loading ? "Analysing..." : "Analyse"}
                    </Button>
                    {downloadLink && (
                        <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline">Download Report</Button>
                        </a>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
