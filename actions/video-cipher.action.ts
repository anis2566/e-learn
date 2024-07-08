"use server"

import { db } from "@/lib/db";
import axios from "axios"
import { revalidatePath } from "next/cache";

export const GET_CREDENTIALS = async (title: string) => {
    const res = await fetch(`https://dev.vdocipher.com/api/videos?title=${title}`, {
        method: "PUT",
        headers: {
            "Authorization": "Apisecret 9n3WhfUjIZX44cEHLdBmW1kLwzoM7RxKWWkqk8D019ViEOPDyUXWpBSNxwvwU3C0"
        }
    });

    if (!res.ok) {
        throw new Error(`Fail to obtain credentials`);
    }

    const data = await res.json();

    return {
        payload: data?.clientPayload,
        videoId: data?.videoId
    }
}


export const UPLOAD_VIDEO = async (formData: FormData) => {
    const uploadLink = formData.get('uploadLink') as string;
    const videoId = formData.get('videoId') as string;
    const chapterId = formData.get('chapterId') as string;
    const courseId = formData.get('courseId') as string;

    formData.delete("uploadLink")
    formData.delete("videoId")
    formData.delete("chapterId")
    formData.delete("courseId")


    try {
        await axios.post(uploadLink, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        await db.chapter.update({
            where: {
                id: chapterId
            }, 
            data: {
                videoUrl: videoId
            }
        })

        revalidatePath(`/admin/course/${courseId}/chapters/${chapterId}`)

        return {
            success: "Video uploded"
        };
    } catch (error) {
        throw new Error("Faild to upload video")
    }
}