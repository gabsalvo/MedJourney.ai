"use client"

import * as React from "react"
import { FolderPlusIcon, FolderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock Data for Projects
const mockProjects = [
    { id: 1, name: "Cancer Dataset Analysis", lastEdited: "Today" },
    { id: 2, name: "Heart Disease Prediction", lastEdited: "2 days ago" },
    { id: 3, name: "Diabetes Risk Clustering", lastEdited: "1 week ago" }
]

export function ProjectsView() {
    const [search, setSearch] = React.useState("")

    const filteredProjects = mockProjects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">📁 My Projects</h2>
                <Button className="flex gap-2">
                    <FolderPlusIcon className="h-5 w-5" />
                    Create New Project
                </Button>
            </div>

            <Input
                placeholder="🔍 Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="cursor-pointer hover:shadow-lg transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderIcon className="h-5 w-5 text-blue-500" />
                                {project.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-500">
                            Last Edited: {project.lastEdited}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
