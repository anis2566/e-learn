import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock3, Users } from "lucide-react";
import { Category, Chapter, Course } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { IconBadge } from "@/components/admin/course/course-details/icon-badge";

interface CourseWithFeatures extends Course {
    category: Category | null;
    chapters: Chapter[];
    purchases: { id: string }[];
}

interface Props {
    course: CourseWithFeatures
}

export const CourseCard = ({ course }: Props) => {
    return (
        <Link href={`/teacher/courses/${course.id}`}>
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
                        <div className="flex items-center gap-x-1">
                            <IconBadge size="sm" icon={Users} />
                            <span>
                                {course.chapters?.length} students
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <IconBadge size="sm" icon={Clock3} />
                            <span>
                                5 hours
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}


export const CourseCardSkeleton = () => {
    return (
        <div className="grid md:grid-cols-4 gap-6">
            {
                Array.from({ length: 4 }).map((_, index) => (
                    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3" key={index}>
                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                            <Skeleton className="object-cover w-full h-full" />
                        </div>
                        <div className="flex flex-col pt-2 gap-y-1">
                            <Skeleton className="w-full h-6" />
                            <Skeleton className="w-1/3 h-6 rounded-full" />
                            <Skeleton className="w-1/3 h-6 rounded-full" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}