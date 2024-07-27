"use client"

import { useQuery } from "@tanstack/react-query"
import { GET_CHAPTER } from "../action"
import { Clock3, FileQuestion, Loader, Paperclip } from "lucide-react";
import { VideoPlayer } from "@/components/video-player";
import { Controller } from "./controller";
import { Card, CardContent } from "@/components/ui/card";
import { Preview } from "@/components/preview";
import { ListBox } from "@/components/list-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Attachments } from "@/components/dashboard/chapter/attachments";
import { Questions } from "./questions";

interface Props {
    id: string;
    chapterId: string;
}

export const ChapterDetails = ({ id, chapterId }: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["get-chapter-for-teacher", id, chapterId],
        queryFn: async () => {
            const res = await GET_CHAPTER({ courseId: id, chapterId })
            return res
        }
    })

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6 p-4">
                <div className="md:col-span-2 space-y-4">
                    {
                        isLoading ? (
                            <div className="relative aspect-video rounded-md flex items-center justify-center border border-primary/60">
                                <Loader className="w-5 h-5 animate-spin" />
                            </div>
                        ) : (
                            <VideoPlayer videoId={data?.chapter?.videoUrl ?? ""} />
                        )
                    }
                    <Controller courseId={id} previousChapterId={data?.previousChapter ?? ""} nextChapterId={data?.nextChapter ?? ""} />
                </div>
                <Card className="h-full max-h-fit">
                    <CardContent className="p-3">
                        <h1 className="text-xl font-semibold text-primary/80">{data?.chapter?.title}</h1>
                        <div className="-ml-3">
                            <Preview value={data?.chapter?.description || ""} />
                        </div>
                        <div className="space-y-4">
                            <ListBox title="Duration" icon={Clock3} description={"2 hours"} />
                            <ListBox title="Attachments" icon={Paperclip} description={data?.chapter?.attachments?.length?.toString() || "0"} />
                            <ListBox title="Questions" icon={FileQuestion} description={data?.chapter?.questions?.length?.toString() || "0"} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mx-4">
                <CardContent className="p-3">
                    <Tabs defaultValue="questions" className="w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="questions">Questions</TabsTrigger>
                            <TabsTrigger value="attachments">Attachments</TabsTrigger>
                        </TabsList>
                        <TabsContent value="questions" className="max-h-[80vh] flex flex-col justify-between">
                            <Questions chapterId={chapterId} courseId={id} />
                        </TabsContent>
                        <TabsContent value="attachments">
                            <Attachments chapterId={chapterId} />
                        </TabsContent>
                    </Tabs>

                </CardContent>
            </Card>
        </div>
    )
}