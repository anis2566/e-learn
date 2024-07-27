"use server"

import { db } from "@/lib/db"

export const GET_TEACHERS = async () => {
    const teachers = await db.teacher.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    return {teachers}
}