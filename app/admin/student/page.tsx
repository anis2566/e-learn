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
import { StudentList } from "@/components/admin/student";
import { Header } from "@/components/admin/category/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "E-Learn | Students",
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

const Student = async ({searchParams}:Props) => {
    const { search, page, perPage, sort } = searchParams
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const students = await db.user.findMany({
        where: {
            ...(search && { name: { contains: search, mode: "insensitive" } })
        },
        include: {
            purchases: { 
                select: {
                    id: true
                }
            },
        },
        orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalStudent = await db.user.count({
        where: {
            ...(search && { name: { contains: search, mode: "insensitive" } })
        },
    })

    const totalPage = Math.ceil(totalStudent / itemsPerPage)

    console.log(students)

    return (
        <ContentLayout title="Student">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Student</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Student List</CardTitle>
                    <CardDescription>A collection of student.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <StudentList students={students} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Student;