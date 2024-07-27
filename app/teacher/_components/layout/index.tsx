"use client";

import { useUser } from "@clerk/nextjs";
import { Status } from "@prisma/client";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "./sidebar";
import { Pending } from "./pending";

export default function TeacherLayoutPanel({
    children
}: {
    children: React.ReactNode;
}) {
    const sidebar = useSidebar(useSidebarToggle, (state) => state);
    const { user } = useUser()
    const pathname = usePathname()

    if (!sidebar) return null;

    const isNoLayout = pathname.includes("/chapters")


    return (
        <>
            {
                isNoLayout ? children : (
                    <>
                        <Sidebar />
                        <main
                            className={cn(
                                "min-h-[calc(100vh_-_56px)] transition-[margin-left] ease-in-out duration-300",
                                sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64"
                            )}
                        >
                            {
                                user?.publicMetadata?.status === Status.Pending ? (
                                    <Pending />
                                ) : children
                            }
                        </main>
                    </>
                )
            }
        </>
    )
}