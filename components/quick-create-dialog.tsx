"use client";

import { useState, DragEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // or your combobox
// import { Select, ... } if you're using a real combobox from your UI lib

type UploadDialogProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
};

export function QuickCreateDialog({ open, onOpenChange }: UploadDialogProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    // For the combobox or project selection
    const [project, setProject] = useState("");

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

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        // Filter or validate here if you want
        setFiles(droppedFiles);
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        setFiles(Array.from(e.target.files));
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

                {/* Two-column layout */}
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* LEFT COLUMN - File Upload */}
                    <div>
                        <p className="text-sm text-muted-foreground">Upload your Files (CSV, Excel, or TXT):</p>
                        <div
                            className={`
                mt-2 p-6 border-2 border-dashed rounded-md transition-colors
                ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              `}
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
                            <Button className="cursor-pointer" asChild>
                                <label>
                                    Select a file
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        accept=".csv,.xls,.xlsx,.txt"
                                        multiple
                                        hidden
                                    />
                                </label>
                            </Button>
                        </div>

                        {/* Display selected files */}
                        {files.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-medium">Selected File(s):</p>
                                <ul className="list-disc ml-6">
                                    {files.map((file, index) => (
                                        <li key={index} className="text-sm">
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Project Selection / Creation */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Name Your New Project
                        </p>

                        {/* Placeholder combobox / select / input */}
                        {/* You can replace this with your UI library's Select or Combobox */}
                        <Input
                            placeholder="Breast cancer Clustering Analysis..."
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                        />

                        {/* Possibly add a button to create the project */}
                    </div>
                </div>

                {/* Footer Buttons: Cancel/Confirm */}
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                        Cancel
                    </Button>
                    <Button onClick={() => onOpenChange(false)}  className="cursor-pointer">
                        Analyse
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
