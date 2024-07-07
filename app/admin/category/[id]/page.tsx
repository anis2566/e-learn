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

export const metadata: Metadata = {
    title: "E-Learn | Category Courses",
    description: "E-learning Web Application",
};

interface Props {
    params: {
        id: string;
    }
}

const Category = async ({ params: { id } }: Props) => {
    const category = await db.category.findUnique({
        where: {
            id
        }
    })

    if (!category) redirect("/admin")

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
                        <BreadcrumbLink asChild>
                            <Link href="/admin/category">Category</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Courses</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

        </ContentLayout>
    )
}

export default Category