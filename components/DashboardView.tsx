"use client";

import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { UploadPanel } from "@/components/upload-panel";
import { WelcomePanel } from "@/components//welcome-panel";
import { ResultsPanel } from "@/components//results-panel";

export function DashboardView() {
    return (
        <ResizablePanelGroup direction="horizontal" className="h-full w-full p-4">
            {/* Left Panel - Upload & Quick Actions */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="p-4">
                <UploadPanel />
            </ResizablePanel>

            {/* Center Panel - Welcome Section */}
            <ResizablePanel defaultSize={40} minSize={30} maxSize={50} className="p-4">
                <WelcomePanel />
            </ResizablePanel>

            {/* Right Panel - AI Clustering Results */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="p-4">
                <ResultsPanel />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
