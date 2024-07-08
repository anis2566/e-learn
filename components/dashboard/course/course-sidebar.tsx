import { db } from "@/lib/db"
import { getUser } from "@/services/user.service"
import { Chapter, Course } from "@prisma/client";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseWithCahpter extends Course {
    chapters: Chapter[]
}

interface Props {
    course: CourseWithCahpter;
}

export const CourseSidebar = async ({ course }: Props) => {
    const { userId } = await getUser()

    const purchased = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    })


    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="px-8 py-4 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {purchased && (
                    <div className="mt-10">
                        {/* <CourseProgress
                            variant="success"
                            value={progressCount}
                        /> */}
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        // isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        isCompleted={false}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchased}
                    />
                ))}
            </div>
        </div>
    )
}