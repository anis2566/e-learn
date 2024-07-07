"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { UploadDropzone } from "@/lib/uploadthing";
import { UPDATE_CHAPTER } from "@/actions/chapter.action";

interface ChapterVideoFormProps {
    initialData: Chapter;
    chapterId: string;
    courseId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1, {message: "required"}),
});

export const ChapterVideoForm = ({
    initialData,
    chapterId,
    courseId
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { videoUrl: initialData.videoUrl || "" },
    });

    const { mutate: updateChapter, isPending } = useMutation({
        mutationFn: UPDATE_CHAPTER,
        onSuccess: (data) => {
            setIsEditing(false)
            toast.success(data?.success, {
                id: "update-chapter"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-chapter"
            });
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        toast.loading("Chapter updating...", {
            id: "update-chapter"
        })
        updateChapter({ id: chapterId, courseId, values: { ...initialData, videoUrl: values.videoUrl } })
    }

    return (
        <div className="mt-6 border bg-muted rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video URL
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div>
                    {
                        initialData.videoUrl ? (
                            <div className="relative aspect-video mt-2">
                                <video
                                    src={initialData.videoUrl}
                                    controls
                                />
                            </div>
                        ) : (
                            <p className="italic">No video yet</p>
                        )
                    }
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        {
                                            form.getValues("videoUrl") && !initialData.videoUrl ? (
                                                <div className="relative aspect-video mt-2">
                                                    <video
                                                        src={form.getValues("videoUrl")}
                                                        controls
                                                    />
                                                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => form.setValue("videoUrl", "")}>
                                                        <Trash2 className="w-5 h-5 text-rose-500" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <UploadDropzone
                                                    endpoint="videoUploader"
                                                    onClientUploadComplete={(res) => {
                                                        // Do something with the response
                                                        field.onChange(res[0].url)
                                                        // toggleEdit()
                                                        toast.success("Image uploaded")
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error("Image upload failed")
                                                    }}
                                                />
                                            )
                                        }
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isPending}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}