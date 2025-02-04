"use client"

import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { useDebounce } from "@/hooks/use-debounce"

export const Header = () => {
    const [search, setSearch] = useState<string>("")
    const [perPage, setPerPage] = useState<string>("5")
    const [sort, setSort] = useState<string>("")

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchValue = useDebounce(search, 500)

    const handleReset = () => {
        setSearch("")
        setPerPage("5")
        setSort("")
        router.push(pathname)
    }

    useEffect(() => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                search: searchValue
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [searchValue, router, pathname])

    const handlePerPageChange = (perPage: string) => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                perPage,
            }
        }, { skipNull: true, skipEmptyString: true })
        router.push(url)
        setPerPage(perPage)
    }

    const handleSortChange = (sort: string) => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                sort
            }
        }, { skipNull: true, skipEmptyString: true })
        router.push(url)
        setSort(sort)
    }

    return (
        <div className="space-y-2 shadow-sm shadow-primary p-2">
            <p className="text-lg font-semibold">Search & Filter</p>
            <div className="flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
                    <Select value={perPage} onValueChange={(value) => handlePerPageChange(value)}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ["5", "10", "20", "50"].map((v, i) => (
                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <div className="hidden sm:flex relative w-full max-w-[400px]">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name..."
                            className="w-full appearance-none bg-background pl-8 shadow-none"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                    <Button
                        variant="destructive"
                        className="hidden md:flex text-white"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
                <Select value={sort} onValueChange={(value) => handleSortChange(value)}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem value="desc">
                                Newest
                            </SelectItem>
                            <SelectItem value="asc">
                                Oldest
                            </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="sm:hidden flex items-center gap-x-2">
                <div className="relative w-full">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full appearance-none bg-background pl-8 shadow-none"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </div>
                <Button
                    variant="destructive"
                    className="md:hidden text-white"
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </div>
        </div>
    )
}