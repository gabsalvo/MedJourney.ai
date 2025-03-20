"use client";

import React, { useState, useRef, DragEvent } from "react";
import {CloudUploadIcon, UploadCloudIcon} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UploadPanel() {
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle drop event and filter files by accepted extensions.
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
        }
    }

    // Update drag state.
    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }

    // Reset drag state when cursor leaves.
    function handleDragLeave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }

    // Handle file selection via the classic file input.
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
        }
        // Optional: reset the file input.
        e.target.value = "";
    }

    // Trigger file input click.
    function triggerFileSelect() {
        fileInputRef.current?.click();
    }

    return (
        <Card className="h-[350px] flex flex-col justify-between mr-5">
            <CardHeader>
                <CardTitle>
                    <CloudUploadIcon className="mr-2 h-5 w-5" /> Upload Data
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 h-full">
                {/* Drag & Drop Area */}
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
                    <UploadCloudIcon className="h-12 w-12 text-gray-500 mx-auto" />
                    <p className="text-center text-sm text-muted-foreground mt-2">
                        Drag & Drop your file here.
                    </p>
                    <p className="text-center text-xs text-muted-foreground">
                        (Accepted formats: CSV, Excel, or TXT)
                    </p>
                    <input
                        type="file"
                        multiple
                        accept=".csv,.xls,.xlsx,.txt"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                </div>

                {/* Small Button for file selection */}
                <Button size="sm" onClick={triggerFileSelect} className="cursor-pointer">
                    Select a file
                </Button>

                {/* Display selected files, if any */}
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
    );
}
