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
import { CategoryList } from "@/components/admin/category";
import { Header } from "@/components/admin/category/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "E-Learn | Category",
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

const Category = async ({ searchParams }: Props) => {
    const { search, page, perPage, sort } = searchParams
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const categories = await db.category.findMany({
        where: {
            ...(search && { name: { contains: search, mode: "insensitive" } })
        },
        orderBy: {
            createdAt: sort === "asc" ? "asc" : "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalCategory = await db.category.count({
        where: {
            ...(search && { name: { contains: search, mode: "insensitive" } })
        },
    })

    const totalPage = Math.ceil(totalCategory / itemsPerPage)

    return (
        <ContentLayout title="Category">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Category</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Category List</CardTitle>
                    <CardDescription>A collection of category.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <CategoryList categories={categories} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Category