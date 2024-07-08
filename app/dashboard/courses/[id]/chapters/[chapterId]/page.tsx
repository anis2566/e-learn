"use client"

import { GET_CHAPTER } from "@/actions/chapter.action"
import { Banner } from "@/components/admin/banner";
import { useQuery } from "@tanstack/react-query"

interface Props {
    params: {
        id: string;
        chapterId: string;
    };
}


const Chapter = ({ params: { id, chapterId } }: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["get-chapter", id, chapterId],
        queryFn: async () => {
            const res = await GET_CHAPTER({ courseId: id, chapterId })
            return res
        }
    })

    const isLocked = !data?.chapter?.isFree && !data?.purchase;
    const completeOnEnd = !!data?.purchased && !data?.userProgress?.isCompleted;

    return (
        <div>
            {data?.userProgress?.isCompleted && (
                <div className="px-4">
                    <Banner
                        variant="success"
                        label="You already completed this chapter."
                    />
                </div>
            )}
            {isLocked && (
                <div className="px-4">
                    <Banner
                        variant="warning"
                        label="You need to purchase this course to watch this chapter."
                    />
                </div>
            )}
        </div>
    )
}

export default Chapter