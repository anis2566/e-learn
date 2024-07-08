import { CourseNavbar } from "@/components/dashboard/course/course-navbar";
import { CourseSidebar } from "@/components/dashboard/course/course-sidebar";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
        chapterId: string;
    };
    children: React.ReactNode;
}

const ChapterLayout = async ({children, params:{id, chapterId}}:Props) => {
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

    if(!course) redirect("/dashboard")

    return (
        <div className="flex">
            <CourseSidebar course={course} />
            <div className="flex-1">
                <CourseNavbar />
                {children}
            </div>
        </div>
    )
}

export default ChapterLayout