import Link from "next/link";

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
import { Search } from "@/components/dashboard/course/search";
import { Sort } from "@/components/dashboard/course/sort";
import { CourseList } from "@/components/dashboard/course/course-list";

const Courses = () => {
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
                        <BreadcrumbPage>Courses</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-8 mt-4">
                <Search />
                <div className="flex justify-between items-center">
                    <BrowseCategory />
                    <Sort />
                </div>
                <CourseList />
            </div>
        </ContentLayout>
    )
}

export default Courses;