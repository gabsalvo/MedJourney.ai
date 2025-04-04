"use client";

import React, {useState} from "react";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";

import { TipsPanel } from "@/components/tips-panel";
import { SettingsPanel } from "@/components/settings-panel";
import { ResultsPanel } from "@/components/results-panel";
import { ExplainableAIPanel } from "@/components/explainable-ai-view";
import {buildPrompt} from "@/lib/buildprompt";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;


export function Dashboard() {
    const [clustersData, setClustersData] = useState<unknown>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [manifestData, setManifestData] = useState<unknown>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [xaiData, setXaiData] = useState<unknown>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEngineLoading, setIsEngineLoading] = useState(false);
    const [interpretation, setInterpretation] = useState<string | null>(null);


    // 2. Callback chiamata da SettingsPanel a fine analisi
    const handleAnalysisDone = (
        clusters: unknown,
        manifest: unknown,
        xai: unknown
    ) => {
        setClustersData(clusters);
        setManifestData(manifest);
        setXaiData(xai);
        const fetchLLMInterpretation = async () => {
            setIsEngineLoading(true);
            try {
                const res = await fetch(`${API_BASE}/interpret`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: buildPrompt({manifest, clusters, xai})}),
                });
                const data = await res.json();
                setInterpretation(data.interpretation || "✅ LLM responded, but gave no interpretation.");
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setInterpretation("❌ Error calling LLM API.");
            } finally {
                setIsEngineLoading(false);
            }
        };

        fetchLLMInterpretation();
    };

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
                            <SettingsPanel onAnalysisDone={handleAnalysisDone} setIsLoading={setIsLoading} isLoading={isLoading}/>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right side: split vertically (Results & Explainable AI) */}
                <ResizablePanel defaultSize={70} minSize={20}>
                    <ResizablePanelGroup direction="vertical" >
                        {/* Top: Results */}
                        <ResizablePanel defaultSize={63} minSize={20} maxSize={100} className="border-b border-gray-300">
                            <ResultsPanel clusters={clustersData} isLoading={isLoading}/>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Bottom: Explainable AI */}
                        <ResizablePanel defaultSize={30} minSize={10} maxSize={100}>
                            <ExplainableAIPanel isLoading={isLoading || isEngineLoading} modelresponse={interpretation}/>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>

    <div className="flex md:hidden flex-col h-screen overflow-y-auto p-4 space-y-4">
        {/* On mobile, omit TipsPanel */}
        <div>
            <SettingsPanel onAnalysisDone={handleAnalysisDone} setIsLoading={setIsLoading} isLoading={isLoading}/>
        </div>
        <div>
            <ResultsPanel clusters={clustersData} isLoading={isLoading}/>
        </div>
        <div>
            <ExplainableAIPanel isLoading={isLoading || isEngineLoading} modelresponse={interpretation}/>
        </div>
    </div>
</>
    );
}
