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
import { CourseDetails } from "@/components/admin/course/course-details";

export const metadata: Metadata = {
    title: "E-Learn | Course",
    description: "E-learning Web Application",
};

interface Props {
    params: {
        id: string;
    }
}

const Course = async ({ params: { id } }: Props) => {
    const course = await db.course.findUnique({
        where: {
            id
        },
    })

    if (!course) redirect("/admin")

    const chapters = await db.chapter.findMany({
        orderBy: {
            position: "asc"
        }
    })

    return (
        <ContentLayout title="Course">
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
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CourseDetails course={course} chapters={chapters} />
        </ContentLayout>
    )
}

export default Course