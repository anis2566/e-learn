import { redirect } from "next/navigation";

import { db } from "@/lib/db";

interface Props {
    params: {
        id: string;
    }
}

const CourseDetails = async ({ params: { id } }: Props) => {
    const course = await db.course.findUnique({
        where: {
            id,
            isPublished: true
        },
        include: {
            chapters: true
        }
    })
    if (!course) redirect("/teacher")

    return redirect(`/teacher/courses/${course?.id}/chapters/${course?.chapters[0].id}`);
}

export default CourseDetails
