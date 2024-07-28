"use client"

import { EllipsisVertical, ReplyIcon, Trash2 } from "lucide-react";
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import { Question, QuestionReply, Teacher, User } from "@prisma/client";
import en from 'javascript-time-ago/locale/en.json'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuestion, useReply, useStudentQuestionReply } from "@/hooks/use-question";


TimeAgo.addDefaultLocale(en)

interface ExtendedReply extends QuestionReply {
    user: User | null;
    teacher: Teacher | null;
}

interface QuestionWithReplies extends Question {
    replies: ExtendedReply[];
    user: User;
}

interface Props {
    questions: QuestionWithReplies[]
}

export const Questions = ({ questions }: Props) => {
    const { onOpen } = useStudentQuestionReply()
    const { onOpen: onOpenDelete } = useQuestion()
    const { onOpen: onOpenReply } = useReply()

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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <EllipsisVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => onOpen(question.id)}>
                                        <ReplyIcon className="w-4 h-4" />
                                        Reply
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => onOpenDelete(question.id)}>
                                        <Trash2 className="text-rose-500 w-4 h-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                                            <div className="flex items-center">
                                                <ReplyIcon className="w-4 h-4 text-muted-foreground" />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <EllipsisVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => onOpenReply(reply.id)}>
                                                            <Trash2 className="text-rose-500 w-4 h-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
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
        </div>
    )
}
