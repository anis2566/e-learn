import { Chapter, Course, UserProgress } from "@prisma/client";

import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "./course-progress";

interface ChapterWithProgress extends Chapter {
    userProgress: UserProgress[]
}

interface CourseWithCahpter extends Course {
    chapters: ChapterWithProgress[];
}

interface Props {
    course: CourseWithCahpter;
    progressCount: number;
    purchased: boolean;
}

export const CourseSidebar = ({ course, progressCount, purchased }: Props) => {

    return (
        <div className="hidden md:flex h-full border-r flex-col overflow-y-auto shadow-sm">
            <div className="px-8 py-4 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {purchased && (
                    <div className="mt-10">
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter?.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchased}
                    />
                ))}
            </div>
        </div>
    )
}