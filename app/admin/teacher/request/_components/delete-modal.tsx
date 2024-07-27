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

import { useTeacher } from "@/hooks/use-teacher"
import { DELETE_TEACHER } from "../action"

const TeacherDeleteModal = () => {
    const { open, id, onClose } = useTeacher()

    const { mutate: deleteTeacher, isPending } = useMutation({
        mutationFn: DELETE_TEACHER,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "delete-teacher"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-teacher"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Teacher deleting...", {
            id: "delete-teacher"
        })
        deleteTeacher(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete teacher application
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

export default TeacherDeleteModal
