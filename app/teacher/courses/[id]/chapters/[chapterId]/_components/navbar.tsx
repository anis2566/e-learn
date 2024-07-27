import { Chapter, Course } from "@prisma/client";

import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/logo"
import { UserNav } from "@/app/teacher/_components/layout/navbar/user-nav";
import { Notification } from "@/components/notification";

interface CourseWithCahpter extends Course {
    chapters: Chapter[];
}

interface Props {
    course: CourseWithCahpter;
}

export const CourseNavbar = ({ course }: Props) => {
    return (
        <header className="flex-1 sticky top-0 z-10 w-full bg-muted/40 shadow backdrop-blur supports-[backdrop-filter]:bg-muted/40 dark:shadow-secondary">
            <div className="mx-2 sm:mx-8 flex justify-between h-14 items-center">
                {/* <CourseNavDrawer course={course} purchased={purchased} /> */}
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