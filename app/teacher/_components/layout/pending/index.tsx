import { ClockIcon } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { ContentLayout } from "../content-layout"

export const Pending = () => {
    return (
        <ContentLayout title="Pending">
            <div className="flex items-center justify-center h-[80vh]">
                <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
                    <CardHeader className="text-center">
                        <ClockIcon className="h-12 w-12 text-yellow-500 mb-4 mx-auto" />
                        <CardTitle className="text-2xl font-bold">Pending Account</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                            Your account is currently pending approval. Please contact our support team to resolve this issue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-x-5">

                        <Button className="w-full" asChild>
                            <Link href="/teacher/support">
                                Support
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    )
}
