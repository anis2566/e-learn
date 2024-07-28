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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "@/components/admin/content-layout"
import { db } from "@/lib/db";
import { CourseList } from "./_components/course-list";
import { Header } from "@/components/admin/category/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "E-Learn | Questions",
    description: "E-learning Web Application",
};

interface Props {
    searchParams: {
        page: string;
        perPage: string;
        search: string;
        sort: string;
    }
};

const Questions = async ({ searchParams }: Props) => {
    const { search, page, perPage, sort } = searchParams
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const courses = await db.course.findMany({
        where: {
            isPublished: true,
            title: { contains: search, mode: "insensitive" }
        },
        include: {
            questions: {
                include: {
                    replies: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalCourse = await db.course.count({
        where: {
            ...(search && { title: { contains: search, mode: "insensitive" } })
        },
    })

    const totalPage = Math.ceil(totalCourse / itemsPerPage)

    return (
        <ContentLayout title="Question">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Question</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Course List</CardTitle>
                    <CardDescription>A collection of course.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <CourseList courses={courses} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Questions
