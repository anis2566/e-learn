"use client";

import { Loader2, Lock } from "lucide-react";

import { VideoPlayer } from "@/components/video-player";
import { VideoController } from "@/components/video-controller";

interface CoursePlayerProps {
    videoId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    previousChapterId?: string;
    isLocked: boolean;
    isCompleted: boolean;
    purchased: boolean;
};

export const CoursePlayer = ({
    videoId,
    courseId,
    chapterId,
    nextChapterId,
    previousChapterId,
    isLocked,
    isCompleted,
    purchased
}: CoursePlayerProps) => {

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
            <VideoController purchased={purchased} isCompleted={isCompleted} nextChapterId={nextChapterId || ""} previousChapterId={previousChapterId || ""} courseId={courseId} chapterId={chapterId} />
        </div>
    )
}