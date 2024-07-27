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

import { ContentLayout } from "../_components/layout/content-layout"
import { CourseList } from "./_components/list";
import { Search } from "@/components/dashboard/course/search";

export const metadata: Metadata = {
    title: "E-Learn | Courses",
    description: "E-learning Web Application",
};

const Courses = () => {
    return (
        <ContentLayout title="Courses">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/teacher">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Courses</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 space-y-8">
                <Search />
                <CourseList />
            </div>
        </ContentLayout>
    )
}

export default Courses
