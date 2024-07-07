"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Chapter } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

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

interface ChapterThumbnailFormProps {
    initialData: Chapter;
    chapterId: string;
    courseId: string;
};

const formSchema = z.object({
    videoThumbnail: z.string().min(1, {message: "required"}),
});

export const ChapterThumbnailForm = ({
    initialData,
    chapterId,
    courseId
}: ChapterThumbnailFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { videoThumbnail: "" },
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
        updateChapter({ id: chapterId, courseId, values: { ...initialData, videoThumbnail: values.videoThumbnail } })
    }

    return (
        <div className="mt-6 border bg-muted rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter thumbnail
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoThumbnail && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.videoThumbnail && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoThumbnail ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.videoThumbnail}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-8"
                    >
                        <div>
                            <FormField
                                control={form.control}
                                name="videoThumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {
                                                form.getValues("videoThumbnail") ? (
                                                    <div className="relative aspect-video mt-2">
                                                        <Image
                                                            alt="Upload"
                                                            fill
                                                            className="object-cover rounded-md"
                                                            src={form.getValues("videoThumbnail")}
                                                        />
                                                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => form.setValue("videoThumbnail", "")}>
                                                            <Trash2 className="w-5 h-5 text-rose-500" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <UploadDropzone
                                                        endpoint="imageUploader"
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
                            <div className="text-xs text-muted-foreground mt-4">
                                16:9 aspect ratio recommended
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    disabled={isPending}
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}