import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";


import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { ContentLayout } from "@/components/admin/content-layout"
import { ChaptersForm } from "@/components/admin/course/course-details/form/chapters-form";
import { ChapterForm } from "@/components/admin/course/course-details/chapter/chapter-form";

export const metadata: Metadata = {
    title: "E-Learn | Chapter",
    description: "E-learning Web Application",
};

interface Props {
    params: {
        chapterId: string;
    }
}

const Chapter = async ({ params: { chapterId } }: Props) => {
    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId
        },
        include: {
            attachments: true
        }
    })

    if (!chapter) redirect("/admin")

    return (
        <ContentLayout title="Chapter">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin/course">Courses</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Chapter</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <ChapterForm chapter={chapter} />
        </ContentLayout>
    )
}

export default Chapter