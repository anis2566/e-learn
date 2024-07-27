import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { GitPullRequest, Mail, Phone, User } from "lucide-react";

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
import { ListBox } from "@/components/list-box";

export const metadata: Metadata = {
    title: "E-Learn | Teacher Details",
    description: "E-learning Web Application",
};

interface Props {
    params: {
        id: string;
    }
}

const TeacherDetails = async ({ params: { id } }: Props) => {
    const teacher = await db.teacher.findUnique({
        where: {
            id
        }
    })
    if (!teacher) redirect("/admin")

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
                            <Link href="/admin/teacher">Teacher</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-6">
                <Card>
                    <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                        <Image
                            alt="Avatar"
                            className="rounded-full"
                            height="100"
                            src={teacher.imageUrl}
                            style={{
                                aspectRatio: "100/100",
                                objectFit: "cover",
                            }}
                            width="100"
                        />
                        <div className="space-y-1">
                            <div className="font-semibold text-xl text-primary">{teacher.name}</div>
                            <div>{teacher.bio}</div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Informatio</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ListBox icon={User} title="Name" description={teacher.name} />
                            <ListBox icon={Phone} title="Phone" description={teacher.phone} />
                            <ListBox icon={Mail} title="Email" description={teacher.email} />
                            <ListBox icon={GitPullRequest} title="experience" description={teacher.experience?.toString() + " Years" || ""} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>Activity</CardContent>
                    </Card>
                </div>
            </div>
        </ContentLayout>
    )
}

export default TeacherDetails