import { redirect } from "next/navigation";

import { GET_PROGRESS } from "@/actions/user-progress.action";
import { CourseNavbar } from "@/components/dashboard/course/course-navbar";
import { CourseSidebar } from "@/components/dashboard/course/course-sidebar";
import { db } from "@/lib/db";
import { getUser } from "@/services/user.service";

interface Props {
    params: {
        id: string;
        chapterId: string;
    };
    children: React.ReactNode;
}

const ChapterLayout = async ({ children, params: { id, chapterId } }: Props) => {
    const { userId } = await getUser()

    const course = await db.course.findUnique({
        where: {
            id,
        },
        include: {
            chapters: {
                include: {
                    userProgress: {
                        where: {
                            userId
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    })

    if (!course) redirect("/dashboard")

    const purchased = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: id
            }
        }
    })


    const progressCount = await GET_PROGRESS(userId, course.id);

    return (
        <div className="flex">
            <CourseSidebar course={course} progressCount={progressCount} purchased={!!purchased} />
            <div className="flex-1">
                <CourseNavbar course={course} purchased={!!purchased} />
                {children}
            </div>
        </div>
    )
}

export default ChapterLayout