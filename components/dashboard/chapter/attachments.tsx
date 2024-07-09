"use client"

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { GET_ATTACHMENTS } from "@/actions/attachment.action";

interface Props {
    chapterId: string;
}

export const Attachments = ({ chapterId }: Props) => {
    const { data: attachments, isLoading } = useQuery({
        queryKey: ["get-attachments", chapterId],
        queryFn: async () => {
            const res = await GET_ATTACHMENTS(chapterId)
            return res.attachments
        },
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false
    })

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
        }
    }

    if(isLoading) {
        return (
            <FileSkeleton />
        )
    }

    return (
        <div className="mt-2 space-y-3">
            {
                attachments?.map((item, i) => (
                    <div key={i} className="border-2 p-2 rounded-sm flex justify-between items-center">
                        <p className="font-semibold">{item.title}</p>
                        <div className="flex items-center gap-x-3">
                            <Button variant="outline" asChild>
                                <Link href={item.url} target="_blank">View</Link>
                            </Button>
                            <Button onClick={() => handleDownload(item.url, item.title)}>Download</Button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

const FileSkeleton = () => {
    return (
        <div className="space-y-2">
            {
                Array.from({length:3}).map((_, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <Skeleton className="h-8 w-2/6" />
                        <div className="flex items-center gap-x-3">
                            <Skeleton className="h-8 w-[80px]" />
                            <Skeleton className="h-8 w-[80px]" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}