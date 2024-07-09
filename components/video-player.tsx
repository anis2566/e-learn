"use client"

import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query";
import { GENERATE_PLAYER } from "@/actions/video-cipher.action";

interface VideoPlayerProps {
    videoId: string;
    className?: string;
}

export const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {

    const { data } = useQuery({
        queryKey: ["generate-video", videoId],
        queryFn: async () => {
            const res = await GENERATE_PLAYER(videoId)
            return res
        }
    })

    return (
        <div className={cn("relative aspect-video rounded-md")}>
            <iframe
                src={`https://player.vdocipher.com/v2/?otp=${data?.otp}&playbackInfo=${data?.playbackInfo}&player=${process.env.NEXT_PUBLIC_VIDEO_CIPHER_PLAYER_ID}`}
                allowFullScreen={true}
                allow="encrypted-media"
                className={cn("border-none w-full h-full rounded-md", className)}>
            </iframe>
        </div>
    )
}