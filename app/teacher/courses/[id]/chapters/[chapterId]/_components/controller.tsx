import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface Props {
    previousChapterId: string;
    nextChapterId: string;
    courseId: string;
}

export const Controller = ({ previousChapterId, nextChapterId, courseId }: Props) => {
    return (
        <div className="flex justify-between items-center">
            {
                previousChapterId ? (
                    <Link href={`/teacher/courses/${courseId}/chapters/${previousChapterId}`} className={cn(buttonVariants({ variant: "default" }))}>
                        <ChevronLeft />
                        Previous
                    </Link>
                ) : (
                    <Button disabled>
                        <ChevronLeft />
                        Previous
                    </Button>
                )
            }
            {
                nextChapterId ? (
                    <Link href={`/teacher/courses/${courseId}/chapters/${nextChapterId}`} className={cn(buttonVariants({ variant: "default" }))}>
                        Next
                        <ChevronRight />
                    </Link>
                ) : (
                    <Button disabled>
                        Next
                        <ChevronRight />
                    </Button>
                )
            }
        </div>
    )
}