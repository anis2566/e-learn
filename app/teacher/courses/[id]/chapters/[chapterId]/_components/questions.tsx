"use client"

import { useQuery } from "@tanstack/react-query";
import { ReplyIcon } from "lucide-react";
import { useState } from "react";
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { GET_QUESTIONS } from "@/actions/question.action";
import { cn } from "@/lib/utils";
import { useQuestionReply } from "@/hooks/use-question";

TimeAgo.addDefaultLocale(en)

interface Props {
    courseId: string;
    chapterId: string;
}

export const Questions = ({ chapterId, courseId }: Props) => {
    const [page, setPage] = useState<number>(1)

    const {onOpen} = useQuestionReply()

    const { data: questions, isLoading } = useQuery({
        queryKey: ["chpater-questions-for-teacher", courseId, chapterId, page],
        queryFn: async () => {
            const res = await GET_QUESTIONS({ chapterId, courseId, page })
            return res.questions
        },
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false
    })

    if (isLoading) return <QuestionSkeleton />

    return (
        <div className="w-full py-2 overflow-y-auto space-y-6">
            {
                questions?.map(question => (
                    <div className="space-y-4" key={question.id}>
                        <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10 border">
                                <AvatarImage src={question.user?.imageUrl} />
                                <AvatarFallback>{question.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div>
                                    <div className="font-medium text-md">{question.user?.name}</div>
                                    <ReactTimeAgo date={question.createdAt} locale="en-US" className="text-xs" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {question.title}
                                </p>
                            </div>
                            <Button onClick={() => onOpen(question.id)}>Reply</Button>
                        </div>
                        {
                            question.replies?.map((reply => (
                                <div className="flex items-start gap-4 pl-14" key={reply.id}>
                                    <Avatar className="w-10 h-10 border">
                                        <AvatarImage src={reply.teacher?.imageUrl || reply.user?.imageUrl} />
                                        <AvatarFallback>{reply.teacher?.name?.charAt(0) || reply.user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-md">{reply.teacher?.name || reply.user?.name}</div>
                                                <ReactTimeAgo date={reply.createdAt} locale="en-US" className="text-xs" />
                                            </div>
                                            <ReplyIcon className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {reply.reply}
                                        </p>
                                    </div>
                                </div>
                            )))
                        }
                    </div>
                ))
            }
            <Button variant="outline" className={cn("mx-auto block", (questions?.length ?? 0) <= 3 ? "hidden" : "")} onClick={() => setPage(page + 1)}>Show More</Button>
        </div>
    )
}


const QuestionSkeleton = () => {
    return (
        <div className="w-full py-2 overflow-y-auto space-y-6">
            <div className="space-y-4">
                {
                    Array.from({ length: 3 }).map((_, index) => (
                        <div className="flex items-start gap-4" key={index}>
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div>
                                    <Skeleton className="w-1/3 h-6" />
                                </div>
                                <Skeleton className="w-full h-6" />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}