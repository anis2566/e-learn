"use server"

import { db } from "@/lib/db"
import { AttachmentSchema, AttachmentSchemaType } from "@/schema/attachment.schema"
import { revalidatePath } from "next/cache"

export const CREATE_ATTACHMENT = async (values: AttachmentSchemaType) => {
    const {data, success} = AttachmentSchema.safeParse(values)
    if(!success) {
        throw new Error("Invalid input value")
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: data.chapterId
        },
    })

    await db.attachment.create({
        data: {
            ...data
        }
    })

    revalidatePath(`/admin/course/${chapter?.courseId}/chapter/${data.chapterId}`)

    return {
        success: "Attachment created"
    }
}


export const DELETE_ATTACHMENT = async (id: string) => {
    const attachment = await db.attachment.findUnique({
        where: {
            id
        },
        include: {
            chapter: true
        }
    })

    if(!attachment) {
        throw new Error("Attachment not found")
    }

    await db.attachment.delete({
        where: {
            id
        }
    })

    revalidatePath(`/admin/course/${attachment.chapter.courseId}/chapter/${attachment.chapterId}`)

    return {
        success: "Attachment deleted"
    }
}


export const GET_ATTACHMENTS = async (chapterId: string) => {
    const attachments = await db.attachment.findMany({
        where: {
            chapterId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return {
        attachments
    }
}