"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { UploadButton } from "@/lib/uploadthing"
import { TeacherSchema } from "@/schema/teacher.schema"
import { APPLY_TEACHER } from "../action"

export const TeacherForm = () => {
    const { signOut } = useAuth()

    const form = useForm<z.infer<typeof TeacherSchema>>({
        resolver: zodResolver(TeacherSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            imageUrl: "",
            bio: "",
            experience: 1
        },
    })

    const { mutate: applyTeacher, isPending } = useMutation({
        mutationFn: APPLY_TEACHER,
        onSuccess: (data) => {
            toast.success(data?.success, {
                id: "apply-teacher"
            })
            signOut({
                redirectUrl: "/teacher"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "apply-teacher"
            })
        }
    })

    function onSubmit(values: z.infer<typeof TeacherSchema>) {
        toast.loading("Registering...", {
            id: "apply-teacher"
        })
        applyTeacher(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your name" {...field} type="text" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} type="text" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your phone number" {...field} type="number" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Experience</FormLabel>
                                <FormControl>
                                    <Input placeholder="Number of experience" {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little bit about yourself"
                                        className="resize-none"
                                        {...field}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    {
                                        form.getValues("imageUrl") ? (
                                            <div className="relative mt-2">
                                                <Image
                                                    alt="Upload"
                                                    width={120}
                                                    height={120}
                                                    className="object-contain rounded-md mx-auto"
                                                    src={form.getValues("imageUrl")}
                                                />
                                                <Button type="button" className="absolute top-0 right-0" variant="ghost" size="icon" onClick={() => form.setValue("imageUrl", "")} disabled={isPending}>
                                                    <Trash2 className="text-rose-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <UploadButton
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
                    <Button type="submit" className="max-w-[130px]" disabled={isPending}>Submit</Button>
                </div>
            </form>
        </Form>
    )
}