"use client";

import * as z from "zod";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UPDATE_CHAPTER } from "@/actions/chapter.action";

interface ChapterTitleFormProps {
    initialData: Chapter;
    chapterId: string;
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1, {message: "required"}),
});

export const ChapterTitleForm = ({
    initialData,
    chapterId,
    courseId
}: ChapterTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: initialData.title },
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
        updateChapter({ id: chapterId, courseId, values: { ...initialData, title: values.title } })
    }

    return (
        <div className="mt-6 border bg-muted rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="e.g. 'Introduction to the course'"
                                            {...field}
                                        />
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