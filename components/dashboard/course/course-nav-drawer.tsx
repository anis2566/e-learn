import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { CourseSidebarItem } from "./course-sidebar-item";

interface ChapterWithProgress extends Chapter {
    userProgress: UserProgress[]
}

interface CourseWithCahpter extends Course {
    chapters: ChapterWithProgress[];
}

interface Props {
    course: CourseWithCahpter;
    purchased: boolean;
}

export const CourseNavDrawer = ({ course, purchased }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="-mt-3">{course.title}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col w-full overflow-y-auto">
                    {course.chapters.map((chapter) => (
                        <SheetClose key={chapter.id} asChild>
                            <CourseSidebarItem
                                id={chapter.id}
                                label={chapter.title}
                                isCompleted={!!chapter?.userProgress?.[0]?.isCompleted}
                                courseId={course.id}
                                isLocked={!chapter.isFree && !purchased}
                            />
                        </SheetClose>
                    ))}
                </div>
            </SheetContent>
        </Sheet>

    )
}