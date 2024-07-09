"use server"

import { db } from "@/lib/db";
import axios from "axios"
import { revalidatePath } from "next/cache";

export const GET_CREDENTIALS = async (title: string) => {
    const res = await fetch(`https://dev.vdocipher.com/api/videos?title=${title}`, {
        method: "PUT",
        headers: {
            "Authorization": `Apisecret ${process.env.VIDEO_CIPHER_API_KEY}`
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


export const GENERATE_PLAYER = async (videoId: string) => {
  try {
    const res = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        ttl: 300,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${process.env.VIDEO_CIPHER_API_KEY}`,
        },
      }
    );
    return {
      otp: res.data?.otp,
      playbackInfo: res.data?.playbackInfo
    };
  } catch (error) {
      throw new Error("Something went wrong")
  }
};