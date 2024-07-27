"use server"

import { db } from "@/lib/db"
import { TeacherSchema, TeacherSchemaType } from "@/schema/teacher.schema"
import { sendNotification } from "@/services/notification.service"
import { getAdmin, getUser } from "@/services/user.service"
import { clerkClient } from "@clerk/nextjs/server"
import { Role } from "@prisma/client"

export const APPLY_TEACHER = async (values: TeacherSchemaType) => {
    const {data, success} = TeacherSchema.safeParse(values)
    if(!success){
        throw new Error("Invalid input value")
    }

    const teacher = await db.teacher.findFirst({
        where: {
            OR: [
                {
                    email: data.email
                },
                {
                    phone: data.phone
                }
            ]
        }
    })
    if(teacher){
        throw new Error("Teacher already exists")
    }

    const {userId, clerkId, user} = await getUser()

    const updatedUser = await db.user.update({
        where: {
            id: userId
        },
        data: {
            role: Role.Teacher
        }
    })

    const newTeacher = await db.teacher.create({
        data: {
            userId,
            ...data
        }
    })

    await clerkClient.users.updateUser(clerkId, {
        publicMetadata: {
            role: updatedUser.role,
            status: newTeacher.status
        }
    })

    const {adminId} = await getAdmin()

    await sendNotification({
        trigger: "teacher-request",
        actor: {
            id: userId,
            name: user.name
        },
        recipients: [adminId],
        data: {
            redirectUrl: "/admin/teacher/request"
        }
    })

    return {
        success: "Registration successful"
    }
}