"use client";

import { useState } from "react";
import { UploadCloudIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export function UploadPanel() {
    const [setFiles] = useState<File[]>([]);

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            // @ts-expect-error just show
            setFiles(Array.from(event.target.files));
        }
    }

    return (
        <Card className="h-full flex flex-col justify-between">
            <CardHeader>
                <CardTitle>📤 Upload Data</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 h-full">
                <input
                    type="file"
                    multiple
                    accept=".csv,.xls,.xlsx,.txt"
                    hidden
                    id="file-upload"
                    onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <UploadCloudIcon className="h-12 w-12 text-gray-500" />
                    <p className="text-sm text-muted-foreground">Drag & Drop or Click to Upload</p>
                </label>
                <Button className="w-full flex gap-2">
                    <PlayIcon className="w-5 h-5" /> Start New Analysis
                </Button>
            </CardContent>
        </Card>
    );
}