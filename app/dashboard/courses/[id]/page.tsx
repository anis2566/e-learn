import { redirect } from "next/navigation";

import { db } from "@/lib/db";

interface Props {
    params: {
        id: string;
    }
}

const Course = async ({ params: { id } }: Props) => {
    const course = await db.course.findUnique({
        where: {
            id
        },
        include: {
            chapters: true
        }
    })

    if (!course) redirect("/admin")

    return redirect(`/dashboard/courses/${course.id}/chapters/${course.chapters[0].id}`);
}

export default Course