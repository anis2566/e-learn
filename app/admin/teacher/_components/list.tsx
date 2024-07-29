"use client"

import { Teacher } from "@prisma/client";
import { EllipsisVertical, Eye, Pen, RefreshCcw, Trash2 } from "lucide-react";
import Link from "next/link";

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

import { Empty } from "@/components/empty";
import { useTeacher, useTeacherStatus } from "@/hooks/use-teacher";

interface TeacherWithCourse extends Teacher {
    courses: {
        courseId: string;
    }[]
}

interface Props {
    teachers: TeacherWithCourse[]
}

export const TeacherList = ({ teachers }: Props) => {
    const { onOpen } = useTeacherStatus()
    const { onOpen: onOpenTeacher } = useTeacher()

    return (
        <>
            {
                teachers.length < 1 ? (
                    <Empty title="No Teacher Found" />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-2">Image</TableHead>
                                <TableHead className="px-2">Name</TableHead>
                                <TableHead className="px-2">Email</TableHead>
                                <TableHead className="px-2">Phone</TableHead>
                                <TableHead className="px-2">Courses</TableHead>
                                <TableHead className="px-2">Status</TableHead>
                                <TableHead className="px-2">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                teachers.map(teacher => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="px-2 py-2">
                                            <Avatar className="w-9 h-9">
                                                <AvatarImage src={teacher.imageUrl} />
                                                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="px-2 py-2">{teacher.name}</TableCell>
                                        <TableCell className="px-2 py-2">{teacher.email}</TableCell>
                                        <TableCell className="px-2 py-2">{teacher.phone}</TableCell>
                                        <TableCell className="px-2 py-2">{teacher.courses.length}</TableCell>
                                        <TableCell className="px-2 py-2">
                                            <Badge className="bg-amber-500 text-white">{teacher.status}</Badge>
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
                                                        <Link href={`/admin/teacher/${teacher.id}`} className="flex items-center gap-x-3">
                                                            <Eye className="w-4 h-4" />
                                                            View Profile
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/teacher/edit/${teacher.id}`} className="flex items-center gap-x-3">
                                                            <Pen className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => onOpen(teacher.id)}>
                                                        <RefreshCcw className="w-4 h-4" />
                                                        Change Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => onOpenTeacher(teacher.id)}>
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