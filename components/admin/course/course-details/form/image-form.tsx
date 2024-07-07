"use client";

import * as z from "zod";
import { Pencil, PlusCircle, ImageIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { Course } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { UploadDropzone } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { UPDATE_COURSE } from "@/actions/course.action";

interface ImageFormProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "required",
    }),
});

export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: ""
        },
    });

    const { mutate: updateCourse, isPending } = useMutation({
        mutationFn: UPDATE_COURSE,
        onSuccess: (data) => {
            setIsEditing(false)
            toast.success(data?.success, {
                id: "update-course"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-course"
            });
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        toast.loading("Course updating...", {
            id: "update-course"
        })
        updateCourse({ id: courseId, values: { ...initialData, imageUrl: values.imageUrl } })
    }

    return (
        <div className="mt-6 border bg-muted rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course thumbnail
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
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
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {
                                                form.getValues("imageUrl") ? (
                                                    <div className="relative aspect-video mt-2">
                                                        <Image
                                                            alt="Upload"
                                                            fill
                                                            className="object-cover rounded-md"
                                                            src={form.getValues("imageUrl")}
                                                        />
                                                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => form.setValue("imageUrl", "")}>
                                                            <Trash2 className="w-5 h-5 text-rose-500" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <UploadDropzone
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(res) => {
                                                            field.onChange(res[0].url)
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