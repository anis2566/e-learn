import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "../layout/navbar/user-nav"
import { Logo } from "@/components/logo"

export const CourseNavbar = () => {
    return (
        <header className="flex-1 sticky top-0 z-10 w-full bg-muted/40 shadow backdrop-blur supports-[backdrop-filter]:bg-muted/40 dark:shadow-secondary">
            <div className="mx-2 sm:mx-8 flex h-14 items-center">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    {/* <SheetMenu /> */}
                    <Logo callbackUrl="/dashboard" />
                </div>
                <div className="flex flex-1 items-center space-x-2 justify-end">
                    <ModeToggle />
                    {/* <Notification /> */}
                    <UserNav />
                </div>
            </div>
        </header>
    )
}