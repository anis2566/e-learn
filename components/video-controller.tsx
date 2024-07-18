"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button, buttonVariants } from "./ui/button"

import { cn } from "@/lib/utils";
import { MARK_COMPLETE, MARK_INCOMPLETE } from "@/actions/user-progress.action";
import { useConfettiStore } from "@/hooks/use-confetti";

interface Props {
    nextChapterId: string;
    previousChapterId: string;
    courseId: string;
    chapterId: string;
    isCompleted: boolean;
}

export const VideoController = ({ nextChapterId, courseId, previousChapterId, chapterId, isCompleted}: Props) => {

    const {onOpen} = useConfettiStore()
    const queryClient = useQueryClient()

    const { mutate: markComplete, isPending } = useMutation({
        mutationFn: MARK_COMPLETE,
        onSuccess: (data) => {
            onOpen()
            queryClient.invalidateQueries({
                queryKey: ["get-chapter"]
            })
            queryClient.refetchQueries({
                queryKey: ["get-chapter"]
            })
            toast.success(data?.success, {
                id: "chpter-complete"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "chpter-complete"
            })
        }
    })

    const { mutate: markInComplete, isPending: isLoading } = useMutation({
        mutationFn: MARK_INCOMPLETE,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["get-chapter"]
            })
            queryClient.refetchQueries({
                queryKey: ["get-chapter"]
            })
            toast.success(data?.success, {
                id: "chpter-incomplete"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "chpter-incomplete"
            })
        }
    })

    const hanldeComplete = () => {
        if (isCompleted) {
            toast.loading("Chapter incompleting...", {
                id: "chpter-incomplete"
            })
            markInComplete({ chapterId, courseId })
        } else {
            toast.loading("Chapter completing...", {
                id: "chpter-complete"
            })
            markComplete({ chapterId, courseId })
        }
    }

    return (
        <div className="space-y-4 w-full">
            <Button variant="outline" onClick={hanldeComplete} disabled={isPending || isLoading}>
                {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
            <div className="flex justify-between items-center">
                {
                    previousChapterId ? (
                        <Link href={`/dashboard/courses/${courseId}/chapters/${previousChapterId}`} className={cn(buttonVariants({ variant: "default" }))}>
                            <ChevronLeft />
                            Previous
                        </Link>
                    ) : (
                        <Button disabled>
                            <ChevronLeft />
                            Previous
                        </Button>
                    )
                }
                {
                    nextChapterId ? (
                        <Link href={`/dashboard/courses/${courseId}/chapters/${nextChapterId}`} className={cn(buttonVariants({ variant: "default" }))}>
                            Next
                            <ChevronRight />
                        </Link>
                    ) : (
                        <Button disabled>
                            Next
                            <ChevronRight />
                        </Button>
                    )
                }
            </div>
        </div>
    )
}