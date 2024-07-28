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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { db } from "@/lib/db";
import { ContentLayout } from "@/components/admin/content-layout"
import { Questions } from "./_components/questions";
import { Header } from "@/components/admin/category/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "E-Learn | Course Questions",
    description: "E-learning Web Application",
};

interface Props {
    params: {
        id: string;
    },
    searchParams: {
        page: string;
        perPage: string;
        search: string;
        sort: string;
    }
}

const CourseQuestions = async ({ params: { id }, searchParams }: Props) => {
    const { search, page, perPage, sort } = searchParams
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const questions = await db.question.findMany({
        where: {
            courseId: id,
            ...(search && { user: { name: { contains: search, mode: "insensitive" } } })
        },
        include: {
            replies: {
                include: {
                    user: true,
                    teacher: true
                }
            },
            user: true
        },
        orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalQuestion = await db.question.count({
        where: {
            courseId: id,
            ...(search && { user: { name: { contains: search, mode: "insensitive" } } })
        },
    })

    const totalPage = Math.ceil(totalQuestion / itemsPerPage)

    return (
        <ContentLayout title="Questions">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Questions</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Course Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <Questions questions={questions} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default CourseQuestions
