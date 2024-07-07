"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { CREATE_CHAPTER, REORDER_CHAPTER } from "@/actions/chapter.action";
import { ChaptersList } from "../chapter/chapter-list";

interface ChaptersFormProps {
    chapters: Chapter[];
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1),
});

export const ChaptersForm = ({
    chapters,
    courseId
}: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { mutate: createChapter, isPending } = useMutation({
        mutationFn: CREATE_CHAPTER,
        onSuccess: (data) => {
            toggleCreating()
            form.reset()
            toast.success(data?.success, {
                id: "create-chapter"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-chapter"
            });
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        toast.loading("Chapter creating...", {
            id: "create-chapter"
        })
        createChapter({ courseId: courseId, title: values.title })
    }

    const { mutate: reorderChapter, isPending: isReordering } = useMutation({
        mutationFn: REORDER_CHAPTER,
        onSuccess: (data) => {
            toast.success(data?.success, {
                id: "reorder-chapter"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "reorder-chapter"
            });
        }
    })

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        toast.loading("Chapter reordering...", {
            id: "reorder-chapter"
        })
        await reorderChapter({ list: updateData })
    }

    const onEdit = (id: string) => {
        router.push(`/admin/course/${courseId}/chapter/${id}`);
    }

    return (
        <div className="relative mt-6 border bg-muted rounded-md p-4">
            {isReordering && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
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
                        <Button
                            disabled={isPending}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !chapters.length && "text-slate-500 italic"
                )}>
                    {!chapters.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    )
}