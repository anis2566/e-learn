"use server"

import { auth } from "@clerk/nextjs/server"

import { db } from "@/lib/db"
import { redirect } from "next/navigation"

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


// export const getScout = async () => {
//     const { userId } = auth()
    
//     if (!userId) {
//         redirect("/sign-in")
//     }
    
//     const scout = await db.scout.findFirst({
//         where: {
//             user: {
//                 clerkId: userId
//             }
//         }
//     })

//     if (!scout) {
//         throw new Error("Scout not found")
//     }

//     return {scout, scoutId: scout.id, role: scout.role, clerkId: userId, status: scout.status}
// }


// export const getAdmin = async () => {
//     const admin = await db.user.findFirst({
//         where: {
//             role: Role.Admin
//         }
//     })

//     if (!admin) {
//         throw new Error("Admin not found")
//     }

//     return {
//         admin,
//         adminId: admin.id,
//         adminClerkId: admin.clerkId
//     }
// }