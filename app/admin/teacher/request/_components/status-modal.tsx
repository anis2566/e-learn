"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Status } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useTeacherStatus } from "@/hooks/use-teacher"
import { UPDATE_STATUS } from "../action"

const formSchema = z.object({
    status: z
        .nativeEnum(Status)
        .refine((val) => Object.values(Status).includes(val), {
            message: "required",
        }),
})

export const TeacherStatusModal = () => {
    const { id, onClose, open } = useTeacherStatus()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: Status.Pending,
        },
    })

    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: UPDATE_STATUS,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "update-status"
            })
            form.reset()
        },
        onError: (error) => {
            toast.loading(error.message, {
                id: "update-status"
            })
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Status updating...", {
            id: "update-status"
        })
        updateStatus({ id, status: values.status })
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
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(Status).map((value, index) => (
                                                    <SelectItem key={index} value={value}>{value}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.getValues("status") === Status.Pending || isPending}>Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}
