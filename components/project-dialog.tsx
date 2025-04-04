"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Define the structure for the project info returned by the backend.
export type ProjectInfo = {
    name: string;
    zipLink?: string;
    manifest?: {
        n_clusters?: number;
        algorithm?: string;
        created_at?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
};

type ProjectDialogProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    userId: string;
    projectName: string;
};
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function ProjectDialog({
                                  open,
                                  onOpenChange,
                                  userId,
                                  projectName,
                              }: ProjectDialogProps) {
    const [projectData, setProjectData] = useState<ProjectInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        fetch(
            `${API_BASE}/project-info?user_id=${encodeURIComponent(
                userId
            )}&project_name=${encodeURIComponent(projectName)}`
        )
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data: ProjectInfo) => {
                setProjectData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load project info.");
                setLoading(false);
            });
    }, [open, userId, projectName]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{projectData?.name || "Project Details"}</DialogTitle>
                    <DialogDescription>
                        {projectData?.manifest?.algorithm
                            ? `Clustering report using ${projectData.manifest.algorithm}.`
                            : "View metadata and download report."}
                    </DialogDescription>
                </DialogHeader>

                {loading && (
                    <p className="text-sm text-muted-foreground mt-4">
                        Loading project info...
                    </p>
                )}

                {error && (
                    <div className="text-red-500 mt-4">
                        <p>{error}</p>
                        <div className="mt-6 flex justify-end">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}

                {projectData && !error && (
                    <>
                        <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                            {projectData.manifest?.n_clusters !== undefined && (
                                <p>
                                    <strong>Clusters:</strong> {projectData.manifest.n_clusters}
                                </p>
                            )}
                            {projectData.manifest?.created_at && (
                                <p>
                                    <strong>Created:</strong>{" "}
                                    {new Date(
                                        projectData.manifest.created_at
                                    ).toLocaleString()}
                                </p>
                            )}
                        </div>

                        {projectData.zipLink && (
                            <div className="mt-6">
                                <Label className="text-sm font-semibold mb-2 block">
                                    Download Report
                                </Label>
                                <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                    onClick={() => {
                                        const proxyURL = `${API_BASE}/download-proxy?user_id=${userId}&project_name=${projectName}`;
                                        window.open(proxyURL, "_blank");
                                    }}
                                >
                                    Download ZIP
                                </Button>
                            </div>
                        )}
                        <div className="mt-4">
                            <Label className="text-sm font-semibold mb-2 block text-red-600">
                                Danger Zone
                            </Label>
                            <Button
                                variant="destructive"
                                className="cursor-pointer"
                                onClick={async () => {
                                    const confirmDelete = confirm("Are you sure you want to delete this project?");
                                    if (!confirmDelete) return;

                                    try {
                                        setLoading(true);
                                        const res = await fetch(`${API_BASE}/delete-project`, {
                                            method: "GET",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                user_id: userId,
                                                project_name: projectName,
                                            }),
                                        });

                                        if (!res.ok) {
                                            const text = await res.text();
                                            throw new Error(`Delete failed: ${text}`);
                                        }

                                        alert("✅ Project deleted successfully.");
                                        onOpenChange(false); // Close dialog
                                    } catch (err) {
                                        console.error(err);
                                        alert("❌ Failed to delete project.");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                Delete Project
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
