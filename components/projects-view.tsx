"use client";

import React, { useState, useEffect } from "react";
import {
    FolderIcon,
    ArchiveIcon,
    FolderPlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectDialog } from "@/components/project-dialog";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ApiProject {
    id: string | number;
    name: string;
    lastEdited?: string;
}

interface ProjectsApiResponse {
    projects: ApiProject[];
}

interface Project {
    id: number;
    name: string;
    lastEdited?: string;
}

type ViewType =
    | "dashboard"
    | "projects"
    | "askMedAI"
    | "dataLibrary"
    | "reports"
    | "settings"
    | "takeatour";

interface ProjectsViewProps {
    setCurrentView: (view: ViewType) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function ProjectsView({ setCurrentView }: ProjectsViewProps) {
    const [search, setSearch] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<Set<number>>(new Set());

    useEffect(() => {
        const getUserId = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) {
                console.error("Errore nel recupero utente Supabase:", error);
                return;
            }
            setUserId(user.id);
        };

        getUserId();
    }, []);

    useEffect(() => {
        if (!userId) return;
        console.log("🔐 User ID Supabase:", userId);

        const endpoint = `${API_BASE}/projects?user_id=${userId}`;
        fetch(endpoint)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Errore nella fetch: ${res.status}\n${text}`);
                }
                const data: ProjectsApiResponse = await res.json();
                console.log("✅ Dati ricevuti:", data);
                const loadedProjects: Project[] = data.projects.map((p) => ({
                    id: typeof p.id === "string" ? parseInt(p.id, 10) : p.id,
                    name: p.name,
                    lastEdited: p.lastEdited,
                }));
                setProjects(loadedProjects);
            })
            .catch((error) => {
                console.error("❌ Errore nel recupero dei progetti:", error);
            });
    }, [userId]);

    const filteredProjects = projects.filter((proj) =>
        proj.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleRename = (id: number) => {
        setProjects((prev) =>
            prev.map((project) =>
                project.id === id ? { ...project, name: newName || project.name } : project
            )
        );
        setEditingId(null);
    };

    const handleProjectClick = (projectName: string) => {
        setSelectedProjectName(projectName);
        setProjectDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userId || selectedForDelete.size === 0) return;

        const promises = Array.from(selectedForDelete).map(async (projectId) => {
            const project = projects.find((p) => p.id === projectId);
            if (!project) return;

            const res = await fetch(
                `${API_BASE}/delete-project?user_id=${encodeURIComponent(userId)}&project_name=${encodeURIComponent(project.name)}`
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Failed to delete project ${project.name}: ${errorText}`);
            }
        });

        await Promise.all(promises);

        setProjects((prev) => prev.filter((p) => !selectedForDelete.has(p.id)));
        setDeleteMode(false);
        setSelectedForDelete(new Set());
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-2">
                    <FolderIcon className="h-5 w-5 text-blue-700" />
                    <h2 className="text-xl font-semibold">My Projects</h2>
                </div>

                <div className="flex gap-2 ml-auto">
                    {deleteMode ? (
                        <>
                            <Button variant="outline" onClick={() => {
                                setDeleteMode(false);
                                setSelectedForDelete(new Set());
                            }}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleConfirmDelete}>
                                Confirm
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => setDeleteMode(true)}>
                            🗑️ Delete a Project
                        </Button>
                    )}

                    <Button className="gap-2" onClick={() => setCurrentView("dashboard") }>
                        <FolderPlusIcon className="h-4 w-4" />
                        Start New Project
                    </Button>
                </div>
            </div>

            <Input
                placeholder="🔍 Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[20%]"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    <Card
                        key={project.id}
                        className="cursor-pointer hover:shadow-lg transition relative"
                        onClick={() => {
                            if (!deleteMode) handleProjectClick(project.name);
                        }}
                    >
                        {deleteMode && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-3 right-3"
                            >
                                <Checkbox
                                    className="border-2 border-blue-700 rounded-sm"
                                    checked={selectedForDelete.has(project.id)}
                                    onCheckedChange={(checked) => {
                                        const newSelection = new Set(selectedForDelete);
                                        if (checked) newSelection.add(project.id);
                                        else newSelection.delete(project.id);
                                        setSelectedForDelete(newSelection);
                                    }}
                                />
                            </div>
                        )}

                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <ArchiveIcon className="h-5 w-5 text-blue-700" />
                                {editingId === project.id ? (
                                    <Input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onBlur={() => handleRename(project.id)}
                                        onKeyDown={(e) => e.key === "Enter" && handleRename(project.id)}
                                        autoFocus
                                        className="border-b border-blue-700 focus:border-blue-700"
                                    />
                                ) : (
                                    project.name
                                )}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}

                {projectDialogOpen && userId && selectedProjectName && (
                    <ProjectDialog
                        open={projectDialogOpen}
                        onOpenChange={setProjectDialogOpen}
                        userId={userId}
                        projectName={selectedProjectName}
                    />
                )}
            </div>
        </div>
    );
}