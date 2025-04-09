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
import {MedAiChat} from "@/components/med-ai-chat";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ViewType = "dashboard" | "projects" | "askMedAI" | "dataLibrary" | "reports" | "settings" | "takeatour";

interface DashboardProps {
    setActiveView: (view: ViewType) => void;
}

export function Dashboard({ setActiveView }: DashboardProps) {
    const [clustersData, setClustersData] = useState<unknown>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [manifestData, setManifestData] = useState<unknown>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [xaiData, setXaiData] = useState<unknown>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEngineLoading, setIsEngineLoading] = useState(false);
    const [interpretation, setInterpretation] = useState<string | null>(null);
    const [labelsData, setLabelsData] = useState<Record<string, string> | null>(null);
    const [showMedAIChat, setShowMedAIChat] = useState(false);


    // 2. Callback chiamata da SettingsPanel a fine analisi
    const handleAnalysisDone = (
        clusters: unknown,
        manifest: unknown,
        xai: unknown,
        labels: Record<string, string>
    ) => {
        setClustersData(clusters);
        setManifestData(manifest);
        setXaiData(xai);
        setLabelsData(labels);
        const fetchLLMInterpretation = async () => {
            setIsEngineLoading(true);
            try {
                const res = await fetch(`${API_BASE}/interpret`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: buildPrompt({manifest, clusters, xai, labels: labelsData })}),
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
                    maxSize={100}
                    className="border-r border-gray-300 mb-[-300px]"
                >
                    <div className="flex flex-col h-full">
                        {/*<div className="flex-1">
                            <UploadPanel />
                        </div>*/}
                        <div className="flex-1">
                            <SettingsPanel onAnalysisDone={handleAnalysisDone} setIsLoading={setIsLoading} isLoading={isLoading} setCurrentView={setActiveView}/>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right side: split vertically (Results & Explainable AI) */}
                <ResizablePanel defaultSize={70} minSize={20}>
                    <ResizablePanelGroup direction="vertical" >
                        {/* Top: Results */}
                        <ResizablePanel defaultSize={63} minSize={20} maxSize={100} className="border-b border-gray-300">
                            <ResultsPanel clusters={clustersData} isLoading={isLoading} setClusters={setClustersData}/>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Bottom: Explainable AI */}
                        <ResizablePanel defaultSize={30} minSize={10} maxSize={100}>
                            <ExplainableAIPanel isLoading={isLoading || isEngineLoading} modelresponse={interpretation} setModelresponse={setInterpretation} onStartChat={() => setShowMedAIChat(true)}/>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
            <MedAiChat
                open={showMedAIChat}
                onOpenChange={setShowMedAIChat}
                initialMessage={interpretation}
                manifest={manifestData}
                clusters={clustersData}
                xai={xaiData}
                labels={labelsData}
            />

        </div>

    <div className="flex md:hidden flex-col h-screen overflow-y-auto p-4 space-y-4">
        {/* On mobile, omit TipsPanel */}
        <div>
            <SettingsPanel onAnalysisDone={handleAnalysisDone} setIsLoading={setIsLoading} isLoading={isLoading} setCurrentView={setActiveView}/>
        </div>
        <div>
            <ResultsPanel clusters={clustersData} isLoading={isLoading} setClusters={setClustersData}/>
        </div>
        <div>
            <ExplainableAIPanel isLoading={isLoading || isEngineLoading} modelresponse={interpretation} setModelresponse={setInterpretation} onStartChat={() => setShowMedAIChat(true)}/>
        </div>
    </div>
</>
    );
}
