"use client"

import * as React from "react"
import { useState } from "react"
import {FolderIcon, MoreVerticalIcon, PencilIcon, TrashIcon, ArchiveIcon, FolderPlusIcon} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Data for Projects
const initialProjects = [
    { id: 1, name: "Cancer Dataset Analysis", lastEdited: "Today" },
    { id: 2, name: "Heart Disease Prediction", lastEdited: "2 days ago" },
    { id: 3, name: "Diabetes Risk Clustering", lastEdited: "1 week ago" }
]

// @ts-expect-error no prob here with any type
export function ProjectsView({ setCurrentView }) {
    const [search, setSearch] = useState("")
    const [projects, setProjects] = useState(initialProjects)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [newName, setNewName] = useState("")

    // Filter projects by search input
    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
    )

    // Handle Rename Logic
    const handleRename = (id: number) => {
        setProjects((prev) =>
            prev.map((project) =>
                project.id === id ? { ...project, name: newName || project.name } : project
            )
        )
        setEditingId(null) // Close input after renaming
    }

    // Handle Delete Logic
    const handleDelete = (id: number) => {
        setProjects((prev) => prev.filter((project) => project.id !== id))
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                {/* Left side: Icon + Heading */}
                <div className="flex items-center">
                    <FolderIcon className="mr-2 h-5 w-5 text-blue-700" />
                    <h2 className="text-xl font-semibold">My Projects</h2>
                </div>

                {/* Right side: Button */}
                <Button className="gap-2 cursor-pointer hover:bg-zinc-700" onClick={() => setCurrentView("dashboard")}>
                    <FolderPlusIcon className="h-4 w-4" />
                    Start New Project
                </Button>
            </div>
            {/* Search Bar */}
            <Input
                placeholder="🔍 Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[20%]"
            />

            {/* Project Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="cursor-pointer hover:shadow-lg transition relative">
                        <CardHeader className="flex justify-between items-center">
                            {/* Project Name or Editable Input */}
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

                            {/* 3-dot Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="cursor-pointer">
                                        <MoreVerticalIcon className="w-5 h-5 text-gray-500" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setEditingId(project.id)
                                            setNewName(project.name)
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDelete(project.id)}
                                        className="cursor-pointer text-red-500"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>

                        {/* Last Edited Date */}
                        <CardContent className="text-sm text-gray-500">
                            Last Edited: {project.lastEdited}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
