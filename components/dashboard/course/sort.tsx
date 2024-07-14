"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from "next/navigation"
import queryString from "query-string"


export const Sort = () => {
    const pathname = usePathname()
    const router = useRouter()

    const handleChange = (sort: string) => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                sort
            }
        }, {skipEmptyString: true, skipNull: true})

        router.push(url)
    }
    
    return (
        <Select onValueChange={(value) => handleChange(value)}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="desc">Newest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
        </Select>
    )
}