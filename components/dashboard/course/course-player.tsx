"use client";

import { Loader2, Lock } from "lucide-react";
import { Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { VideoPlayer } from "@/components/video-player";
import { VideoController } from "@/components/video-controller";
import { formatPrice } from "@/lib/utils";
import { CREATE_PAYMENT, GENERATE_BKASH_TOKEN } from "@/services/payment.service";

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
    const { mutate: createPayment } = useMutation({
        mutationFn: CREATE_PAYMENT,
        onSuccess: (data) => {
            if (data?.url) {
                window.location.replace(data?.url)
            }
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const { mutate: generateToken, isPending } = useMutation({
        mutationFn: GENERATE_BKASH_TOKEN,
        onSuccess: (data) => {
            console.log(data)
            if (course?.price) {
                if (data?.token) {
                    createPayment({ amount: course.price, token: data?.token, courseId })
                }
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
                    <Button onClick={() => generateToken()} disabled={isPending}>Enroll with {formatPrice(course?.price ?? 0)}</Button>
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