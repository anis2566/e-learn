"use client"

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { CourseCard, CourseCardSkeleton } from "./card";
import { GET_COURSES } from "../action";
import { CustomPagination } from "@/components/custom-pagination";

export const CourseList = () => {
    const searchParams = useSearchParams()

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort")
    const { data: courses, isLoading } = useQuery({
        queryKey: ["get-courses-for-teacher", category, search, sort],
        queryFn: async () => {
            const res = await GET_COURSES({ category, search, sort })
            return res.courses;
        },
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false
    })

    if (isLoading) {
        return (
            <CourseCardSkeleton />
        )
    }

    return (
        <div className="space-y-8">

            <div className="grid md:grid-cols-4 gap-6">
                {
                    courses?.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))
                }
            </div>
            <CustomPagination totalPage={Math.ceil((courses?.length ?? 0) / 8)} />
        </div>
    )
}
