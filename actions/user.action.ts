"use server"

import { db } from "@/lib/db";
import { getUser } from "@/services/user.service";
import { revalidatePath } from "next/cache";

type UpdateUser = {
    name: string;
    imageUrl: string;
}
export const UPDATE_USER = async ({name, imageUrl}:UpdateUser) => {
    const {userId} = await getUser()

    await db.user.update({
        where: {
            id: userId
        },
        data: {
            name, 
            imageUrl
        }
    })

    revalidatePath("/dashboard/profile")

    return {
        success: "Profile updated"
    }
}
