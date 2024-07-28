"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useReply } from "@/hooks/use-question"
import { DELETE_REPLY } from "../action"

export const DeleteReplyModal = () => {
    const { open, id, onClose } = useReply()

    const { mutate: deleteCategory, isPending } = useMutation({
        mutationFn: DELETE_REPLY,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "delete-reply"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-reply"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Reply deleting...", {
            id: "delete-reply"
        })
        deleteCategory(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this reply
                        and remove the data from your servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose} disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/80">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}