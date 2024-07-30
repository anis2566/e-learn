"use client"

import { Question, QuestionReply, Teacher, User } from "@prisma/client";
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { ReplyIcon } from "lucide-react";

TimeAgo.addDefaultLocale(en)

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReplyWithTeacher extends QuestionReply {
    teacher: Teacher | null;
}

interface QuestionWithReplyAndUser extends Question {
    replies: ReplyWithTeacher[];
    user: User;
}

interface Props {
    questions: QuestionWithReplyAndUser[]
}

export const Activity = ({ questions }: Props) => {
    return (
        <Card className="max-h-[60vh] overflow-y-auto">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
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
                                </div>
                                {
                                    question.replies?.map((reply => (
                                        <div className="flex items-start gap-4 pl-14" key={reply.id}>
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarImage src={reply.teacher?.imageUrl} />
                                                <AvatarFallback>{reply.teacher?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-md">{reply.teacher?.name}</div>
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
                </div>
            </CardContent>
        </Card>
    )
}