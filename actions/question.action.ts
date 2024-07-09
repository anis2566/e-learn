"use server"

import { db } from "@/lib/db"
import { QuestionSchema, QuestionSchemaType } from "@/schema/question.schema"
import { getUser } from "@/services/user.service"

export const CREATE_QUESTION = async (values: QuestionSchemaType) => {
    const {data, success} = QuestionSchema.safeParse(values)
    if(!success) {
        throw new Error("Invalid input value")
    }

    const {userId} = await getUser()

    await db.question.create({
        data: {
            userId,
            ...data
        }
    })

    return {
        success: "Question submitted"
    }
}


type GetQuestion = {
    courseId: string;
    chapterId: string;
    page: number;
}
export const GET_QUESTIONS = async ({chapterId, courseId, page}:GetQuestion) => {
    const perPage = 3;

    const questions = await db.question.findMany({
        where: {
            courseId,
            chapterId
        },
        include: {
            user: true,
            replies: true
        },
        orderBy: {
            createdAt: "desc"
        },
        take: perPage * page,
    })

    return {
        questions
    }
}