"use server"

import { auth } from "@clerk/nextjs/server"

import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"

export const getUser = async () => {
    const { userId } = auth()
    
    if (!userId) {
        throw new Error("User not found")
    }
    
    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    return {user, userId:user.id, clerkId:userId}
}


export const getTeacher = async () => {
    const { userId } = auth()
    
    if (!userId) {
        redirect("/sign-in")
    }
    
    const teacher = await db.teacher.findFirst({
        where: {
            user: {
                clerkId: userId
            }
        }
    })

    if (!teacher) {
        throw new Error("Teacher not found")
    }

    return {teacher, teacherId: teacher.id}
}


export const getAdmin = async () => {
    const admin = await db.user.findFirst({
        where: {
            role: Role.Admin
        }
    })

    if (!admin) {
        throw new Error("Admin not found")
    }

    return {
        admin,
        adminId: admin.id,
        adminClerkId: admin.clerkId
    }
}