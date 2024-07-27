"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useQuestionReply } from "@/hooks/use-question"
import { Textarea } from "@/components/ui/textarea"
import { QUESTION_REPLY } from "../action"

const formSchema = z.object({
    reply: z.string().min(1, { message: "required" }),
})


export const QuestionReplyModal = () => {

    const { id, open, onClose } = useQuestionReply()
    const queryClient = useQueryClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reply: "",
        },
    })

    const { mutate: replyQuestion, isPending } = useMutation({
        mutationFn: QUESTION_REPLY,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["chpater-questions-for-teacher"]
            })
            queryClient.refetchQueries({
                queryKey: ["chpater-questions-for-teacher"]
            })
            onClose()
            toast.success(data?.success, {
                id: "question-reply"
            })
            form.reset()
        },
        onError: (error) => {
            toast.loading(error.message, {
                id: "question-reply"
            })
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Replying...", {
            id: "question-reply"
        })
        replyQuestion({ id, reply: values.reply })
    }
    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Status</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                        <FormField
                            control={form.control}
                            name="reply"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reply</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your answer"
                                            className="resize-none"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}