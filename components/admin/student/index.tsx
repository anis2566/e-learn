import { User } from "@prisma/client";

import { EllipsisVertical, Eye, Pen, Trash2 } from "lucide-react"
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

import { Empty } from "@/components/empty";

interface StudentWithFeature extends User {
    purchases: { id: string }[]
}

interface Props {
    students: StudentWithFeature[]
}

export const StudentList = ({ students }: Props) => {
    return (
        <>
            {
                students.length < 1 ? (
                    <Empty title="No Student Found" />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-2">Image</TableHead>
                                <TableHead className="px-2">Name</TableHead>
                                <TableHead className="px-2">Email</TableHead>
                                <TableHead className="px-2">Courses</TableHead>
                                <TableHead className="px-2">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                students.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="px-2 py-2">
                                            <Avatar className="w-9 h-9">
                                                <AvatarImage src={student.imageUrl} />
                                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="px-2 py-2">{student.name}</TableCell>
                                        <TableCell className="px-2 py-2">{student.email}</TableCell>
                                        <TableCell className="px-2 py-2">{student.purchases?.length}</TableCell>
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
                                                        <Link href={`/admin/student/${student.id}`} className="flex items-center gap-x-3">
                                                            <Eye className="w-4 h-4" />
                                                            View Profile
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/student/edit/${student.id}`} className="flex items-center gap-x-3">
                                                            <Pen className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="w-flex items-center gap-x-3">
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