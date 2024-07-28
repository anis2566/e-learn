import { Course, Question } from "@prisma/client"
import { MoveRight } from "lucide-react"
import Link from "next/link"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/empty"

interface QuestionWithReplies extends Question {
    replies: { id: string }[]
}

interface CourseWithQuestion extends Course {
    questions: QuestionWithReplies[]
}

interface Props {
    courses: CourseWithQuestion[];
}

export const CourseList = ({ courses }: Props) => {
    return (
        <div>
            <>
                {
                    courses.length < 1 ? (
                        <Empty title="No Course Found" />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-2">Title</TableHead>
                                    <TableHead className="px-2">Total Question</TableHead>
                                    <TableHead className="px-2">Unreplied Question</TableHead>
                                    <TableHead className="px-2">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    courses.map(course => {
                                        const unrepliedQuestions = course.questions.filter(q => q.replies.length === 0).length;
                                        return (
                                            <TableRow key={course.id}>
                                                <TableCell className="px-2 py-2">{course.title}</TableCell>
                                                <TableCell className="px-2 py-2">{course.questions.length}</TableCell>
                                                <TableCell className="px-2 py-2">{unrepliedQuestions}</TableCell>
                                                <TableCell className="px-2 py-2">
                                                    <Button size="sm" asChild>
                                                        <Link href={`/admin/question/${course.id}`}>
                                                            <MoveRight />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                    )
                                }
                            </TableBody>
                        </Table>
                    )
                }
            </>
        </div>
    )
}