"use client";

import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";

import { WelcomePanel } from "@/components/welcome-panel";
import { UploadPanel } from "@/components/upload-panel";
import { SettingsPanel } from "@/components/settings-panel";
import { ResultsPanel } from "@/components/results-panel";
import { ExplainableAIPanel } from "@/components/explainable-ai-view";

export function Dashboard() {
    return (
        <div className="flex flex-col h-screen overflow-y-hidden">
            {/* Top Fixed Panel (non-resizable) */}
            <div className="md:h-24 w-full">
                <WelcomePanel />
            </div>

            {/* Bottom: Full flex space. Split horizontally between left & right. */}
            <ResizablePanelGroup className="flex-grow" direction="horizontal">
                {/* Left side: fixed vertical split (non-resizable vertically) */}
                <ResizablePanel
                    defaultSize={40}
                    minSize={20}
                    maxSize={80}
                    className="border-r border-gray-300"
                >
                    <div className="flex flex-col h-[750px]">
                        <div className="flex-1">
                            <UploadPanel />
                        </div>
                        <div className="flex-1">
                            <SettingsPanel />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle />

                {/* Right side: split vertically (Results & Explainable AI) */}
                <ResizablePanel defaultSize={60} minSize={20}>
                    <ResizablePanelGroup direction="vertical" className="h-500">
                        {/* Top: Results */}
                        <ResizablePanel defaultSize={30} minSize={20} className="border-b border-gray-300">
                            <ResultsPanel />
                        </ResizablePanel>

                        <ResizableHandle />

                        {/* Bottom: Explainable AI */}
                        <ResizablePanel defaultSize={10} minSize={10}>
                            <ExplainableAIPanel />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
