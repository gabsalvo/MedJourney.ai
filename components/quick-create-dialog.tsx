"use client"

import React, { useState, DragEvent } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface QuickCreateDialogProps {
    open: boolean
    onOpenChange: (value: boolean) => void
}

export function QuickCreateDialog({ open, onOpenChange }: QuickCreateDialogProps) {
    const [dragActive, setDragActive] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    // Gestisce il drop dei file
    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const filesArray = Array.from(e.dataTransfer.files)
        // Filtra i file che non siano CSV, Excel (xls/xlsx) o txt
        const acceptedExtensions = [".csv", ".xls", ".xlsx", ".txt"]
        const filteredFiles = filesArray.filter(file => {
            const fileName = file.name.toLowerCase()
            return acceptedExtensions.some(ext => fileName.endsWith(ext))
        })

        if (filteredFiles.length) {
            console.log("File validi caricati:", filteredFiles)
            setFiles(filteredFiles)
        } else {
            console.log("Nessun file valido trovato!")
        }
    }

    // Previene il comportamento di default su dragover e dragenter
    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    // Togli lo stato "dragging" quando il cursore esce dall’area
    function handleDragLeave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }

    // Caricamento classico via input file
    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const filesArray = e.target.files ? Array.from(e.target.files) : []
        // Stessa logica di filtro
        const acceptedExtensions = [".csv", ".xls", ".xlsx", ".txt"]
        const filteredFiles = filesArray.filter(file => {
            const fileName = file.name.toLowerCase()
            return acceptedExtensions.some(ext => fileName.endsWith(ext))
        })

        if (filteredFiles.length) {
            console.log("File validi caricati via input:", filteredFiles)
            setFiles(filteredFiles)
        } else {
            console.log("Nessun file valido via input!")
        }
        // Reset input (opzionale)
        e.target.value = ""
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Get New Insights on your data</DialogTitle>
                    <DialogDescription>
                        Upload your Files (CSV, Excel o TXT) dragging them here or using the Upload Button.
                    </DialogDescription>
                </DialogHeader>

                {/* Area Drag & Drop */}
                <div
                    className={`
                        mt-4 p-6 border-2 border-dashed rounded-md transition-colors
                        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                    `}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <p className="text-center text-sm text-muted-foreground">
                        Drag & Drop your file, formats accepted: CSV, XLS, XLSX o TXT.
                    </p>
                </div>

                {/* Pulsante di Upload classico */}
                <div className="mt-4 flex justify-center">
                    <Button className="cursor-pointer" asChild>
                        <label>
                            Select a file
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                accept=".csv,.xls,.xlsx,.txt"
                                multiple
                                hidden
                            />
                        </label>
                    </Button>
                </div>

                {/* Display selected files */}
                {files.length > 0 && (
                    <div className="mt-2">
                        <p className="text-sm font-medium">Selected File:</p>
                        <ul className="list-disc ml-6">
                            {files.map((file, index) => (
                                <li key={index} className="text-sm">{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
                    <Button className="cursor-pointer" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="cursor-pointer bg-blue-700 hover:bg-blue-500" onClick={() => onOpenChange(false)}>
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
