import { Chapter, Course } from "@prisma/client";

import { CourseSidebarItem } from "./sidebar-item";


interface CourseWithCahpter extends Course {
    chapters: Chapter[];
}

interface Props {
    course: CourseWithCahpter;
}

export const CourseSidebar = ({ course }: Props) => {
    return (
        <div className="hidden md:flex h-full border-r flex-col overflow-y-auto shadow-sm">
            <div className="px-8 py-4 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        courseId={course.id}
                    />
                ))}
            </div>
        </div>
    )
}