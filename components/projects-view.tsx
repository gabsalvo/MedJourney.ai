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
export function ProjectsView({ setCurrentView }: ProjectsViewProps) {
    const [search, setSearch] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null);

    // Retrieve the authenticated user ID using Supabase auth.
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

    // Fetch projects from your backend when userId is set.
    useEffect(() => {
        if (!userId) return;
        console.log("🔐 User ID Supabase:", userId);

        const endpoint = `http://127.0.0.1:8000/api/projects?user_id=${userId}`;
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

    // Filter projects by search term.
    const filteredProjects = projects.filter((proj) =>
        proj.name.toLowerCase().includes(search.toLowerCase())
    );

    // Handlers for renaming and deleting projects (for in-memory updates).
    const handleRename = (id: number) => {
        setProjects((prev) =>
            prev.map((project) =>
                project.id === id ? { ...project, name: newName || project.name } : project
            )
        );
        setEditingId(null);
    };


    // When a project card is clicked, store the selected project name and open the dialog.
    const handleProjectClick = (projectName: string) => {
        setSelectedProjectName(projectName);
        setProjectDialogOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <FolderIcon className="mr-2 h-5 w-5 text-blue-700" />
                    <h2 className="text-xl font-semibold">My Projects</h2>
                </div>
                <Button
                    className="gap-2 cursor-pointer hover:bg-zinc-700"
                    onClick={() => setCurrentView("dashboard")}
                >
                    <FolderPlusIcon className="h-4 w-4" />
                    Start New Project
                </Button>
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
                        onClick={() => handleProjectClick(project.name)}
                    >
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
