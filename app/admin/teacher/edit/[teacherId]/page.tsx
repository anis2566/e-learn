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
import { EditForm } from "./_components/edit-form";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
    title: "E-Learn | Edit Teacher",
    description: "E-learning Web Application",
};

interface Props {
    params: {
        teacherId: string;
    }
}


const EditTeacher = async ({ params: { teacherId } }: Props) => {
    const teacher = await db.teacher.findUnique({
        where: {
            id: teacherId
        }
    })
    if (!teacher) redirect("/admin")

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
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <BackButton />

            <EditForm teacher={teacher} id={teacherId} />
        </ContentLayout>
    )
}

export default EditTeacher
