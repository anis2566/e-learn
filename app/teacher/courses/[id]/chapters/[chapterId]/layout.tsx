import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseSidebar } from "./_components/sidebar";
import { CourseNavbar } from "./_components/navbar";

interface Props {
    params: {
        id: string;
        chapterId: string;
    };
    children: React.ReactNode;
}

const ChapterLayout = async ({ children, params: { id } }: Props) => {

    const course = await db.course.findUnique({
        where: {
            id,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            }
        }
    })

    if (!course) redirect("/teacher")

    return (
        <div className="flex">
            <CourseSidebar course={course} />
            <div className="flex-1">
                <CourseNavbar course={course} />
                {children}
            </div>
        </div>
    )
}

export default ChapterLayout