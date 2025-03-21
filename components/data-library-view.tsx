"use client";

import { useState } from "react"
import * as React from "react";
import { DatabaseIcon, UploadCloudIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickCreateDialog } from "@/components/quick-create-dialog"

export function DataLibraryView() {
    const [quickCreateOpen, setQuickCreateOpen] = useState(false)

    return (
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <DatabaseIcon className="h-5 w-5 text-blue-700" />
                        Data Library
                    </h2>
                    <Button className="flex gap-2 cursor-pointer" onClick={() => setQuickCreateOpen(true)}>
                        <UploadCloudIcon className="h-5 w-5" />
                        Upload Data
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>📁 No Data Uploaded Yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Start uploading medical datasets for analysis.
                    </CardContent>
                </Card>
                {/* ✅ Move Dialog Here to Ensure It's Always Rendered */}
                <QuickCreateDialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen} />
            </div>
    )
}
