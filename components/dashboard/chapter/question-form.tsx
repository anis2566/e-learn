"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { QuestionSchema } from "@/schema/question.schema"
import { CREATE_QUESTION } from "@/actions/question.action"

interface Props {
    courseId: string;
    chapterId: string;
}

export const QuestionForm = ({chapterId, courseId}:Props) => {

    const queryClient = useQueryClient()

    const form = useForm<z.infer<typeof QuestionSchema>>({
        resolver: zodResolver(QuestionSchema),
        defaultValues: {
            title: "",
            courseId,
            chapterId
        },
    })

    const {mutate: createQuestion, isPending} = useMutation({
        mutationFn: CREATE_QUESTION,
        onSuccess: (data) => {
            form.reset()
            queryClient.invalidateQueries({
                queryKey: ["chpater-questions"]
            })
            queryClient.refetchQueries({
                queryKey: ["chpater-questions"]
            })
            toast.success(data?.success, {
                id: "create-question"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-question"
            });
        }
    })

    function onSubmit(values: z.infer<typeof QuestionSchema>) {
        toast.loading("Question submitting...", {
            id: "create-question"
        })
        createQuestion(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex gap-x-3 shadow-sm shadow-primary p-2 rounded-md">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us your question"
                                        className="resize-none flex-1"
                                        {...field}
                                        disabled={isPending}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={form.watch("title") === "" || isPending}>Submit</Button>
                </div>
            </form>
        </Form>
    )
}
