import { Chapter, Course, UserProgress } from "@prisma/client";

import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "../layout/navbar/user-nav"
import { Logo } from "@/components/logo"
import { CourseNavDrawer } from "./course-nav-drawer"
import { Notification } from "@/components/notification";

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

export const CourseNavbar = ({course, purchased}:Props) => {
    return (
        <header className="flex-1 sticky top-0 z-10 w-full bg-muted/40 shadow backdrop-blur supports-[backdrop-filter]:bg-muted/40 dark:shadow-secondary">
            <div className="mx-2 sm:mx-8 flex justify-between h-14 items-center">
                <CourseNavDrawer course={course} purchased={purchased} />
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <Logo callbackUrl="/dashboard" />
                </div>
                <div className="flex items-center space-x-2 justify-end">
                    <ModeToggle />
                    <Notification />
                    <UserNav />
                </div>
            </div>
        </header>
    )
}