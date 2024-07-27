"use client"

import { Button } from "@/components/ui/button"
import { MoveLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export const BackButton = () => {
    const router = useRouter()

    const handleClick = () => {
        router.back()
    }

    return (
        <Button variant="outline" className="flex items-center gap-x-2" onClick={handleClick}>
            <MoveLeft className="w-5 h-5" />
            Go Back
        </Button>
    )
}
