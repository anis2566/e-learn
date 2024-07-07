"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Attachment, Chapter } from "@prisma/client";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { UploadButton } from "@/lib/uploadthing";
import { CREATE_ATTACHMENT, DELETE_ATTACHMENT } from "@/actions/attachment.action";

interface ChapterTitleFormProps {
    attachments: Attachment[];
    chapterId: string;
};

const formSchema = z.object({
    title: z.string().min(1, {message: "required"}),
    url: z.string().min(1, {message: "required"}),
});

export const ChapterAttachmentsForm = ({
    attachments,
    chapterId,
}: ChapterTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", url: "" },
    });

    const { mutate: createAttachment, isPending } = useMutation({
        mutationFn: CREATE_ATTACHMENT,
        onSuccess: (data) => {
            form.reset()
            setIsEditing(false)
            toast.success(data?.success, {
                id: "create-attachment"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-attachment"
            });
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        toast.loading("Attachment creating...", {
            id: "create-attachment"
        })
        createAttachment({ chapterId, ...values })
    }

    const { mutate: deleteAttachment } = useMutation({
        mutationFn: DELETE_ATTACHMENT,
        onSuccess: (data) => {
            toast.success(data?.success, {
                id: "delete-attachment"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-attachment"
            });
        }
    })

    const handleDelete = (id: string) => {
        toast.loading("Attachment deleting...", {
            id: "delete-attachment"
        })
        deleteAttachment(id)
    }

    return (
        <div className="mt-6 border bg-muted rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Add attachment
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="mt-2 space-y-3">
                    {
                        attachments.length > 0 &&
                        attachments.map((item, i) => (
                            <div key={i} className="border-2 p-2 rounded-sm flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <span className="text-muted-foreground text-sm">{item.url}</span>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon">
                                            <Trash className="w-5 h-5" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this attachment and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-destructive" onClick={() => handleDelete(item.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Attachment Name</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Attachment</FormLabel>
                                    <FormControl>
                                        {
                                            form.getValues("url") ? (
                                                <div className="flex items-center gap-x-3">
                                                    <Link href={form.getValues("url")} className="hover:underline" target="_blank">View File</Link>
                                                    <Button variant="ghost" size="icon" onClick={() => form.setValue("url", "")} type="button" disabled={isPending}>
                                                        <Trash className="text-rose-500" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <UploadButton
                                                    endpoint="fileUploader"
                                                    onClientUploadComplete={(res) => {
                                                        field.onChange(res[0].url)
                                                        toast.success("File uploaded")
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error("File upload failed")
                                                    }}
                                                />
                                            )
                                        }
                                    </FormControl>
                                    <FormDescription>Only Pdf file is allowed</FormDescription>
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