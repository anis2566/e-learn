"use client"

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { GET_MY_COURSES } from "@/actions/course.action";
import { CourseCard, CourseCardSkeleton } from "../card/course-card";
import { Empty } from "@/components/empty";

export const CourseList = () => {
    const searchParams = useSearchParams()
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort")

    const { data: courses, isLoading } = useQuery({
        queryKey: ["get-my-courses", category, search, sort],
        queryFn: async () => {
            const res = await GET_MY_COURSES({ category, search, sort })
            return res.courses;
        },
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false
    })

    if(courses?.length === 0) {
        return (
            <div className="h-[50vh] flex items-center justify-center">
                <Empty title="No Course Found" />
            </div>
        )
    }

    return (
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
    )
}