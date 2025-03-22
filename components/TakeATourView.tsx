"use client"

import { useState } from "react"
import HeroVideoDialog from "@/components/magicui/hero-video-dialog"

export function TakeATourView() {
    // If we want to open the dialog by default
    const [isOpen, setIsOpen] = useState(true)

    return (
        <HeroVideoDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            showThumbnail={false} // ensures no preview is shown
            animationStyle="top-in-bottom-out" thumbnailSrc={""}
             className="z-auto"       />
    )
}
