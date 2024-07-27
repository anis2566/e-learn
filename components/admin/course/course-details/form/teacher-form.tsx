"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Course, CourseTeacher, Teacher } from "@prisma/client";
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

import { ASSIGN_TEACHER, REMOVE_TEACHER} from "@/actions/course.action";
import { MultiSelect } from "@/components/ui/multi-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeacherWithCourse extends CourseTeacher {
    teacher: Teacher;
}

interface CourseWithTeacher extends Course {
    teachers: TeacherWithCourse[];
}

interface TeacherProps {
    initialData: CourseWithTeacher;
    courseId: string;
    teachers: Teacher[]
};

const formSchema = z.object({
    teachers: z
        .array(z.string())
});

export const TeacherForm = ({
    initialData,
    courseId,
    teachers
}: TeacherProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const formatedTeachers = teachers.map(teacher => ({ label: teacher.name, value: teacher.id })) || []

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teachers: [],
        },
    });

    const { mutate: updateCourse, isPending } = useMutation({
        mutationFn: ASSIGN_TEACHER,
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


    const { mutate: removeTeacher} = useMutation({
        mutationFn: REMOVE_TEACHER,
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
        updateCourse({ courseId, teachers: values.teachers })
    }

    const handleRemove = (teacherId: string) => {
        toast.loading("Course updating...", {
            id: "update-course"
        })
        removeTeacher({teacherId, courseId})
    }

    return (
        <div className="mt-6 border bg-muted rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Teachers
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit teachers
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div>
                    {
                        initialData.teachers.map(item => (
                            <div key={item.teacherId} className="flex items-center gap-x-2 border border-primary px-4 py-2 rounded-full max-w-fit bg-white">
                                <Avatar>
                                    <AvatarImage src={item.teacher.imageUrl || ""} />
                                    <AvatarFallback>{item.teacher.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p>{item.teacher.name}</p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                                            <Trash2 className="w-5 h-5 text-rose-500" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this teacher from this course
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleRemove(item.teacherId)}>Continue</AlertDialogAction>
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
                            name="teachers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <MultiSelect
                                            options={formatedTeachers}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            placeholder="Select teachers"
                                            variant="inverted"
                                            animation={2}
                                            maxCount={10}
                                            disabled={isPending}
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