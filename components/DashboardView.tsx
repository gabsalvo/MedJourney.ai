"use client";

import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";

import { TipsPanel } from "@/components/tips-panel";
import { UploadPanel } from "@/components/upload-panel";
import { SettingsPanel } from "@/components/settings-panel";
import { ResultsPanel } from "@/components/results-panel";
import { ExplainableAIPanel } from "@/components/explainable-ai-view";

export function Dashboard() {
    return (
        <>
        <div className="hidden md:flex flex-col h-[820px]">
            {/* Top Fixed Panel (non-resizable) */}
            <div className="h-auto w-full mb-5">
                <TipsPanel/>
            </div>

            {/* Bottom: Full flex space. Split horizontally between left & right. */}
            <ResizablePanelGroup className="flex-grow" direction="horizontal" >
                {/* Left side: fixed vertical split (non-resizable vertically) */}
                <ResizablePanel
                    defaultSize={40}
                    minSize={20}
                    maxSize={80}
                    className="border-r border-gray-300 mb-[-300px]"
                >
                    <div className="flex flex-col h-[750px]">
                        {/*<div className="flex-1">
                            <UploadPanel />
                        </div>*/}
                        <div className="flex-1">
                            <SettingsPanel />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right side: split vertically (Results & Explainable AI) */}
                <ResizablePanel defaultSize={70} minSize={20}>
                    <ResizablePanelGroup direction="vertical" >
                        {/* Top: Results */}
                        <ResizablePanel defaultSize={63} minSize={20} className="border-b border-gray-300">
                            <ResultsPanel />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Bottom: Explainable AI */}
                        <ResizablePanel defaultSize={30} minSize={10}>
                            <ExplainableAIPanel />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>

    <div className="flex md:hidden flex-col h-screen overflow-y-auto p-4 space-y-4">
        {/* On mobile, omit TipsPanel */}
        <div>
            <UploadPanel />
        </div>
        <div>
            <SettingsPanel />
        </div>
        <div>
            <ResultsPanel />
        </div>
        <div>
            <ExplainableAIPanel />
        </div>
    </div>
</>
    );
}
