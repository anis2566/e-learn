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
import { EditCategoryForm } from "@/components/admin/category/edi-category-form";
import { ContentLayout } from "@/components/admin/content-layout"

export const metadata: Metadata = {
    title: "E-Learn | Edit Category",
    description: "E-learning Web Application",
};

interface Props {
    params: {
        id: string;
    }
}

const EditCategory = async ({ params: { id } }: Props) => {
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
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditCategoryForm category={category} />
        </ContentLayout>
    )
}

export default EditCategory