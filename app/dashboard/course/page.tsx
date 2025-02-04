import Link from "next/link";
import type { Metadata } from "next";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/components/dashboard/content-layout"
import { BrowseCategory } from "@/components/dashboard/browse/category";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/dashboard/card/course-card";

export const metadata: Metadata = {
    title: "E-Learn | Browse",
    description: "E-learning Web Application",
};


const BrowseCourse = async () => {
    const courses = await db.course.findMany({
        where: {
            isPublished: true
        },
        include: {
            category: true,
            chapters: true
        }
    })
    
    return (
        <ContentLayout title="Browse">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Browse</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-6 mt-4">
                <BrowseCategory />
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                    {
                        courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    }
                </div>
            </div>
        </ContentLayout>
    )
}

export default BrowseCourse;