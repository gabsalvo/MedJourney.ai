"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// Example structure to hold project info (files, reports, etc.)
type ProjectInfo = {
    name: string;
    files: Array<{ id: number; fileName: string; uploadedAt: string }>;
    hasReport: boolean;
    reportLink?: string;
    clusterVisualLink?: string;
};

type ProjectDialogProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    project?: ProjectInfo;  // optional prop to pass the project's info
};

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
    // Dummy fallback if no project prop is passed
    const defaultProject: ProjectInfo = {
        name: "Untitled Project",
        files: [
            { id: 1, fileName: "patient_data.csv", uploadedAt: "2025-03-18" },
            { id: 2, fileName: "lab_results.xlsx", uploadedAt: "2025-03-20" },
        ],
        hasReport: true,
        reportLink: "#",        // placeholder link
        clusterVisualLink: "#", // placeholder link
    };

    const currentProject = project || defaultProject;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{currentProject.name}</DialogTitle>
                    <DialogDescription>
                        View the files and any available clustering reports for this project.
                    </DialogDescription>
                </DialogHeader>

                {/* Main Content Scrollable Area (optional) */}
                <ScrollArea className="max-h-[300px]">
                    {/* Files List */}
                    <Label className="text-sm font-semibold mb-2 block">Files</Label>
                    <div className="grid gap-4">
                        {currentProject.files.map((f) => (
                            <Card key={f.id}>
                                <CardHeader className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">{f.fileName}</CardTitle>
                                    <span className="text-xs text-muted-foreground">
                    {f.uploadedAt}
                  </span>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>

                    {/* If a report is generated, show it */}
                    {currentProject.hasReport && (
                        <div className="mt-6">
                            <Label className="text-sm font-semibold mb-2 block">Report</Label>
                            <Card>
                                <CardContent className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        A clustering report is available. You can review the details below or download it.
                                    </p>
                                    <Button variant="outline" asChild>
                                        <a href={currentProject.reportLink ?? "#"} target="_blank" rel="noopener noreferrer">
                                            View/Download Report
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* If there is a clustering visualization link, show it */}
                    {currentProject.clusterVisualLink && (
                        <div className="mt-6">
                            <Label className="text-sm font-semibold mb-2 block">Clustering Visual</Label>
                            <Card>
                                <CardContent className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Visual representation of the clusters. You can open it in a new tab or embed it directly.
                                    </p>
                                    <Button variant="outline" asChild>
                                        <a href={currentProject.clusterVisualLink} target="_blank" rel="noopener noreferrer">
                                            View Clusters
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </ScrollArea>

                {/* Footer Buttons */}
                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
