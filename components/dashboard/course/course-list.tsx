"use client"

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { GET_COURSES } from "@/actions/course.action";
import { CourseCard, CourseCardSkeleton } from "../card/course-card";
import { CustomPagination } from "@/components/custom-pagination";

export const CourseList = () => {
    const searchParams = useSearchParams()
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort")

    const { data: courses, isLoading } = useQuery({
        queryKey: ["get-courses-browse", category, search, sort],
        queryFn: async () => {
            const res = await GET_COURSES({ category, search, sort })
            return res.courses;
        },
    })

    return (
        <div className="space-y-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-6">
                {
                    isLoading ? Array.from({ length: 4 }).map((_, i) => (
                        <CourseCardSkeleton key={i} />
                    )) :
                        courses?.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))
                }
            </div>
            {
                courses && (
                    <CustomPagination totalPage={Math.ceil(courses.length / 8)} />
                )
            }
        </div>
    )
}