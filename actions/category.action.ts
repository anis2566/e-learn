"use server"

import { db } from "@/lib/db"
import { CategorySchema, CategorySchemaType } from "@/schema/category.schema"
import { revalidatePath } from "next/cache"

export const CREATE_CATEGORY = async (values: CategorySchemaType) => {
    const { data, success } = CategorySchema.safeParse(values)
    if (!success) {
        throw new Error("Invalid input value")
    }

    const category = await db.category.findFirst({
        where: {
            name: data.name
        }
    })
    if (category) {
        throw new Error("Category already exists")
    }

    await db.category.create({
        data: {
            ...data
        }
    })

    return {
        success: "Category created"
    }
}

export const GET_CATEGORIES = async () => {
    const categories = await db.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    return {
        categories
    }
}


type EditCategory = {
    id: string;
    values: CategorySchemaType
}
export const EDIT_CATEGORY = async ({id, values}:EditCategory) => {
    const { data, success } = CategorySchema.safeParse(values)
    if (!success) {
        throw new Error("Invalid input value")
    }

    const category = await db.category.findUnique({
        where: {
            id
        }
    })
    if(!category) {
        throw new Error("Category not found")
    }

    await db.category.update({
        where: {
            id
        },
        data: {
            ...data
        }
    })

    revalidatePath("/admin/category")

    return {
        success: "Category updated"
    }
}


export const DELETE_CATEGORY = async (id: string) => {
    const category = await db.category.findUnique({
        where: {
            id
        }
    })
    if(!category) {
        throw new Error("Category not found")
    }

    await db.category.delete({
        where: {
            id
        },
     })

    revalidatePath("/admin/category")

    return {
        success: "Category deleted"
    }
}