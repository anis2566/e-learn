"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import queryString from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { GET_CATEGORIES } from "@/actions/category.action"
import { cn } from "@/lib/utils"


export const BrowseCategory = () => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const { data: categories, isLoading } = useQuery({
        queryKey: ["category-for-browse"],
        queryFn: async () => {
            const res = await GET_CATEGORIES()
            return res.categories
        },
        staleTime: 60 * 60 * 1000
    })

    const handleClick = (category: string) => {
        if (searchParams.get("category") === category) {
            router.push(pathname)
        } else {
            const url = queryString.stringifyUrl({
                url: pathname,
                query: {
                    category
                }
            }, { skipEmptyString: true, skipNull: true })
            router.push(url)
        }
    }

    if(isLoading) return <CategorySkeleton />

    return (
        <div className="flex items-center gap-x-3">
            {
                categories?.map(category => {
                    const active = searchParams.get("category") === category.name
                    return (
                        <Badge
                            key={category.id}
                            className={cn(
                                "flex h-10 items-center gap-x-2 p-2 cursor-pointer border-primary",
                            )}
                            variant={active ? "default" : "outline"}
                            onClick={() => handleClick(category.name)}
                        >
                            <Image
                                src={category.imageUrl}
                                alt="Category"
                                height={20}
                                width={20}
                                className="rounded-full"
                            />
                            {category.name}
                        </Badge>
                    )
                })
            }
        </div>
    )
}

const CategorySkeleton = () => {
    return (
        <div className="flex items-center gap-x-3">
            {
                Array.from({length: 4}).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-24 rounded-full flex items-center gap-x-2 p-2 cursor-pointer border-primary" />
                ))
            }
        </div>
    )
}