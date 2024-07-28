"use client";

import { Loader2, Lock } from "lucide-react";
import { Course } from "@prisma/client";

import { VideoPlayer } from "@/components/video-player";
import { VideoController } from "@/components/video-controller";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { INIT_PAYMENT } from "@/services/payment.service";

interface CoursePlayerProps {
    videoId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    previousChapterId?: string;
    isLocked: boolean;
    isCompleted: boolean;
    purchased: boolean;
    course: Course | null;
};

export const CoursePlayer = ({
    videoId,
    courseId,
    chapterId,
    nextChapterId,
    previousChapterId,
    isLocked,
    isCompleted,
    purchased,
    course
}: CoursePlayerProps) => {

    const { mutate } = useMutation({
        mutationFn: INIT_PAYMENT,
        onSuccess: (data) => {
            console.log(data?.data?.payment_url)
            if(data.data?.payment_url) {
                window.location.href = data.data?.payment_url
            }
        },
        onError: (error) => {
            console.log(error)
        }
    })

    return (
        <div className="space-y-4">
            <div className="relative aspect-video">
                {!isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                    </div>
                )}
                {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                        <Lock className="h-8 w-8" />
                        <p className="text-sm">
                            This chapter is locked
                        </p>
                    </div>
                )}
                {!isLocked && (
                    <VideoPlayer videoId={videoId} />
                )}
            </div>
            {!purchased && (
                <div className="flex justify-end">
                    <Button onClick={() => mutate()}>Enroll with {formatPrice(course?.price ?? 0)}</Button>
                </div>
            )}
            {
                purchased && (
                    <VideoController isCompleted={isCompleted} nextChapterId={nextChapterId || ""} previousChapterId={previousChapterId || ""} courseId={courseId} chapterId={chapterId} />
                )
            }
        </div>
    )
}