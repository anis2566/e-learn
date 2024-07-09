"use client"

import { useQuery } from "@tanstack/react-query"
import { FileQuestion, Paperclip } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { GET_CHAPTER } from "@/actions/chapter.action"
import { Banner } from "@/components/admin/banner";
import { CoursePlayer } from "@/components/dashboard/course/course-player";
import { Preview } from "@/components/preview";
import { Questions } from "@/components/dashboard/chapter/questins";
import { QuestionForm } from "@/components/dashboard/chapter/question-form";
import { ListBox } from "@/components/list-box";
import { cn } from "@/lib/utils";
import { Attachments } from "@/components/dashboard/chapter/attachments";

interface Props {
    params: {
        id: string;
        chapterId: string;
    };
}


const Chapter = ({ params: { id, chapterId } }: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["get-chapter", id, chapterId],
        queryFn: async () => {
            const res = await GET_CHAPTER({ courseId: id, chapterId })
            return res
        }
    })

    const isLocked = !data?.chapter?.isFree && !data?.purchase;
    const isCompleted = data?.purchased && data?.userProgress?.isCompleted
    const purchased = !!data?.purchased ?? false

    return (
        <div className="space-y-2 my-2">
            {!isLoading && isCompleted && (
                <div className="px-4">
                    <Banner
                        variant="success"
                        label="You already completed this chapter."
                    />
                </div>
            )}
            {!isLoading && isLocked && (
                <div className="px-4">
                    <Banner
                        variant="warning"
                        label="You need to purchase this course to watch this chapter."
                    />
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 p-4">
                {
                    isLoading ? <PlayerSkeleton /> : (
                        <div className="md:col-span-2">
                            <CoursePlayer
                                chapterId={chapterId}
                                courseId={id}
                                nextChapterId={data?.nextChapter ?? undefined}
                                previousChapterId={data?.previousChapter ?? undefined}
                                videoId={data?.chapter?.videoUrl || ""}
                                isLocked={isLocked}
                                isCompleted={isCompleted ?? false}
                                purchased={purchased}
                            />
                        </div>
                    )
                }
                {
                    isLoading ? <CourseDetailsSkeleton /> : (
                        <Card className="h-[40vh]">
                            <CardContent className="p-3">
                                <h1 className="text-xl font-semibold text-primary/80">{data?.chapter?.title}</h1>
                                <div className="-ml-3">
                                    <Preview value={data?.chapter?.description || ""} />
                                </div>
                                <div className="space-y-2">
                                    <ListBox title="Attachments" icon={Paperclip} description={data?.chapter?.attachments?.length?.toString() || "0"} />
                                    <ListBox title="Questions" icon={FileQuestion} description={data?.chapter?.questions?.length?.toString() || "0"} />
                                </div>
                            </CardContent>
                        </Card>
                    )
                }
            </div>
            {
                isLoading && purchased ? <CourseFeatureSkeleton /> : (
                    <Card className={cn("hidden mx-4", purchased && "block")}>
                        <CardContent className="p-3">
                            <Tabs defaultValue="questions" className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="questions">Questions</TabsTrigger>
                                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                                </TabsList>
                                <TabsContent value="questions" className="max-h-[80vh] flex flex-col justify-between">
                                    <Questions courseId={id} chapterId={chapterId} />
                                    <QuestionForm courseId={id} chapterId={chapterId} />
                                </TabsContent>
                                <TabsContent value="attachments">
                                    <Attachments chapterId={chapterId} />
                                </TabsContent>
                            </Tabs>

                        </CardContent>
                    </Card>
                )
            }
        </div>
    )
}

const PlayerSkeleton = () => {
    return (
        <div className="md:col-span-2">
            <div className="relative aspect-video">
                <Skeleton className="w-full h-full rounded-md" />
            </div>
        </div>
    )
}

const CourseDetailsSkeleton = () => {
    return (
        <Card>
            <CardContent className="p-3 space-y-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-2/3 h-12" />
                <Skeleton className="w-1/3 h-10" />
                <Skeleton className="w-1/3 h-10" />
            </CardContent>
        </Card>
    )
}

const CourseFeatureSkeleton = () => {
    return (
        <Skeleton className="w-full h-[50vh] ml-4 mr-4" />
    )
}

export default Chapter

