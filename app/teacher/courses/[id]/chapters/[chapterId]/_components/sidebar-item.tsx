"use client";

import { PlayCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface CourseSidebarItemProps {
    label: string;
    id: string;
    courseId: string;
};

export const CourseSidebarItem = ({
    label,
    id,
    courseId,
}: CourseSidebarItemProps) => {
    const pathname = usePathname();

    const isActive = pathname?.includes(id);

    return (
        <Link
            href={`/dashboard/courses/${courseId}/chapters/${id}`}
            className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 h-12 overflow-hidden",
                isActive && "text-slate-700 bg-slate-200/20 dark:bg-muted dark:text-white hover:bg-slate-200/20 hover:text-slate-700",
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <PlayCircle
                    size={22}
                    className={cn(
                        "text-slate-500",
                        isActive && "text-slate-700 dark:text-white",
                    )}
                />
                {label}
            </div>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-slate-700 transition-all h-full",
                isActive && "opacity-100",
            )} />
        </Link>
    )
}