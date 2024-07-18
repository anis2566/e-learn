import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Category, Chapter, Course } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

import { CourseProgress } from "../course/course-progress";
import { IconBadge } from "@/components/admin/course/course-details/icon-badge";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseWithFeatures extends Course {
    category: Category | null;
    chapters: Chapter[];
    progress?: number | null;
}

interface Props {
    course: CourseWithFeatures
}

export const CourseCard = ({ course }: Props) => {
    console.log(course)
    return (
        <Link href={`/dashboard/courses/${course.id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={course.title}
                        src={course.imageUrl || ""}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {course.title}
                    </div>
                    <Badge variant="outline" className="w-fit bg-accent dark:bg-accent/60 text-white">
                        {course.category?.name}
                    </Badge>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {course.chapters?.length} {course.chapters?.length === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    {course.progress && course.progress !== null ? (
                        <CourseProgress
                            variant={course.progress === 100 ? "success" : "default"}
                            size="sm"
                            value={course.progress}
                        />
                    ) : (
                        <p className="text-md md:text-sm font-medium text-slate-700">
                            {formatPrice(course.price ?? 0)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}


export const CourseCardSkeleton = () => {
    return (
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3">
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Skeleton className="object-cover w-full h-full" />
            </div>
            <div className="flex flex-col pt-2 gap-y-1">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-1/3 h-6 rounded-full" />
                <Skeleton className="w-1/3 h-6 rounded-full" />
                <Skeleton className="w-1/3 h-6 rounded-full" />
            </div>
        </div>
    )
}