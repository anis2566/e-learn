"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UploadButton} from "@/lib/uploadthing"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { Trash } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { CREATE_CATEGORY } from "@/actions/category.action"
import { CategorySchema } from "@/schema/category.schema"
import { MultiSelect } from "@/components/ui/multi-select"
import { CATEGORY_TAG_LIST } from "@/constant"
 

export const CategoryForm = () => {

    const router = useRouter()

    const form = useForm<z.infer<typeof CategorySchema>>({
            resolver: zodResolver(CategorySchema),
            defaultValues: {
            name: "",
            description: "",
            imageUrl: "",
            tags: []
        },
    })

    const {mutate: createCategory, isPending} = useMutation({
        mutationFn: CREATE_CATEGORY,
        onSuccess: (data) => {
            router.push("/admin/category")
            form.reset()
            toast.success(data?.success, {
                id: "create-category"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-category"
            });
        }
    })

    const onSubmit = async (values: z.infer<typeof CategorySchema>) => {
        toast.loading("Category creating...", {
            id: "create-category"
        })
        createCategory(values)
    }

    return (
        <Form {...form}>
            <form className="grid flex-1 items-start gap-4 md:gap-8" onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Identity</CardTitle>
                        <CardDescription>Give the category name and description</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter category name" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell about category"
                                            className="resize-none"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Media </CardTitle>
                        <CardDescription>Provide category image</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
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
                                                    <Button className="absolute top-0 right-0" variant="ghost" size="icon" onClick={() => form.setValue("imageUrl", "")} disabled={isPending}>
                                                        <Trash className="text-rose-500" />
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
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Tags</CardTitle>
                        <CardDescription>Provide some tags</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                    options={CATEGORY_TAG_LIST}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder="Select options"
                                    variant="inverted"
                                    animation={2}
                                    maxCount={3}
                                    disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <Button type="submit" disabled={isPending} className="w-full max-w-[130px]">
                    Submit
                </Button>
            </form>
        </Form>
    )
}
