"use client"

import { Chapter, Course } from "@prisma/client"
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, LayoutDashboard, ListChecks } from "lucide-react";

import { GET_CATEGORIES } from "@/actions/category.action";
import { Banner } from "../../banner";
import { Actions } from "./action";
import { IconBadge } from "./icon-badge";
import { TitleForm } from "./form/title-form";
import { DescriptionForm } from "./form/description-form";
import { ImageForm } from "./form/image-form";
import { CategoryForm } from "./form/category-form";
import { PriceForm } from "./form/price-form";
import { ChaptersForm } from "./form/chapters-form";

interface Props {
    course: Course;
    chapters: Chapter[]
}

export const CourseDetails = ({ course, chapters }: Props) => {
    const { data: categories } = useQuery({
        queryKey: ["get-categories-for-course"],
        queryFn: async () => {
            const res = await GET_CATEGORIES();
            return res.categories
        },
        staleTime: 60 * 60 * 1000
    })

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        chapters?.some(chapter => chapter.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <Banner
                    label="This course is unpublished. It will not be visible to the students."
                />
            )}
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-medium mt-6">
                            Course setup
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <Actions
                        disabled={!isComplete}
                        courseId={course.id}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your course
                            </h2>
                        </div>
                        <TitleForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <DescriptionForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <ImageForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            categories={categories ?? []}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Course chapters
                                </h2>
                            </div>
                            <ChaptersForm
                                chapters={chapters}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className="text-xl">
                                    Sell your course
                                </h2>
                            </div>
                            <PriceForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}