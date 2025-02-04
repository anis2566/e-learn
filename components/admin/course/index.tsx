"use client"

import { Course, Category } from "@prisma/client"
import { Edit, EllipsisVertical, Trash2 } from "lucide-react"
import Link from "next/link"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import { Empty } from "@/components/empty"
import { cn } from "@/lib/utils"
import { useCourse } from "@/hooks/use-course"

interface CourseWithFeatures extends Course {
    category: Category | null;
    chapters: { id: string }[];
    purchases: {id: string}[]
}

interface Props {
    courses: CourseWithFeatures[]
}

export const CourseList = ({ courses }: Props) => {
    const {onOpen} = useCourse()

    return (
        <>
            {
                courses.length < 1 ? (
                    <Empty title="No Course Found" />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-2">Image</TableHead>
                                <TableHead className="px-2">Title</TableHead>
                                <TableHead className="px-2">Category</TableHead>
                                <TableHead className="px-2">Chapters</TableHead>
                                <TableHead className="px-2">Price</TableHead>
                                <TableHead className="px-2">Sell</TableHead>
                                <TableHead className="px-2">Publish</TableHead>
                                <TableHead className="px-2">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                courses.map(course => (
                                    <TableRow key={course.id}>
                                        <TableCell className="px-2 py-2">
                                            <Avatar className="w-9 h-9">
                                                <AvatarImage src={course.imageUrl || ""} />
                                                <AvatarFallback>{course.title.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="px-2 py-2">{course.title}</TableCell>
                                        <TableCell className="px-2 py-2">
                                            <Badge>{course.category?.name}</Badge>
                                        </TableCell>
                                        <TableCell className="px-2 py-2">{course.chapters?.length}</TableCell>
                                        <TableCell className="px-2 py-2">&#2547;{course.price}</TableCell>
                                        <TableCell className="px-2 py-2">{course.purchases.length}</TableCell>
                                        <TableCell className="px-2 py-2">
                                            <Badge
                                                className={cn(
                                                    "bg-green-500 text-white",
                                                    course.isPublished ? "" : "bg-rose-500"
                                                )}
                                            >
                                                {course.isPublished ? "Published" : "Unpublished"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-2 py-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <EllipsisVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/course/${course.id}`} className="flex items-center gap-x-3">
                                                            <Edit className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => onOpen(course.id)}>
                                                        <Trash2 className="text-rose-500 w-4 h-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                )
            }
        </>
    )
}