import Link from "next/link";
import type { Metadata } from "next";

import { ContentLayout } from "@/components/admin/content-layout"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { CategoryForm } from "@/components/admin/category/category-form";

export const metadata: Metadata = {
  title: "E-Learn | Create Category",
  description: "E-learning Web Application",
};


const CreateCategory = () => {
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
                    <BreadcrumbPage>Create</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CategoryForm />
        </ContentLayout>
    )
}

export default CreateCategory