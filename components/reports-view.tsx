"use client";

import * as React from "react";
import { ClipboardListIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock Data for Reports
const mockReports = [
    { id: 1, name: "Cancer Cluster Analysis", generated: "Today" },
    { id: 2, name: "Heart Risk Report", generated: "3 days ago" },
    { id: 3, name: "Diabetes Risk Factors", generated: "1 week ago" },
];

export function ReportsView() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ClipboardListIcon className="h-5 w-5 text-blue-500" />
                    Reports
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockReports.map((report) => (
                    <Card key={report.id} className="cursor-pointer hover:shadow-lg transition">
                        <CardHeader>
                            <CardTitle>{report.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-500">
                            Generated: {report.generated}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
