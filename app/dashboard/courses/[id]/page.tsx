"use client"

import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { GET_COURSE } from "@/actions/course.action";

interface Props {
    params: {
        id: string;
    }
}

const Course = ({ params: { id } }: Props) => {

    const {data: course, isLoading} = useQuery({
        queryKey: ["get-course", id],
        queryFn: async () => {
            const res = await GET_COURSE(id)
            return res.course
        },
        enabled: !!id
    })

    if(isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
            </div>
        )
    }

    return redirect(`/dashboard/courses/${course?.id}/chapters/${course?.chapters[0].id}`);
}

export default Course