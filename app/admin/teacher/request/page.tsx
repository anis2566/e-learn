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
import { Header } from "@/components/admin/category/header";
import { db } from "@/lib/db";
import { CustomPagination } from "@/components/custom-pagination";
import RequestList from "./_components/list";
import { Status } from "@prisma/client";

export const metadata: Metadata = {
    title: "E-Learn | Teacher Request",
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

const Requests = async ({ searchParams }: Props) => {
    const { search, page, perPage, sort } = searchParams
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const teachers = await db.teacher.findMany({
        where: {
            // status: Status.Pending,
            ...(search && { name: { contains: search, mode: "insensitive" } })
        },
        orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalTeacher = await db.teacher.count({
        where: {
            // status: Status.Pending,
            ...(search && { name: { contains: search, mode: "insensitive" } })
        },
    })

    const totalPage = Math.ceil(totalTeacher / itemsPerPage)

    return (
        <ContentLayout title="Teacher">
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
                            <Link href="/admin/teacher">Teachers</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Request</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>List</CardTitle>
                    <CardDescription>A collection of teacher request.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <RequestList teachers={teachers} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Requests
