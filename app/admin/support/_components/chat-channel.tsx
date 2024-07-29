"use client"

import { useAuth } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Channel, ChannelHeader, ChannelHeaderProps, MessageInput, MessageList, useChatContext, Window } from "stream-chat-react"

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { getUserByClerkId } from "@/services/user.service";

interface ChatChannelProps {
    open: boolean;
    openSidebar: () => void;
}

export const ChatChannel = ({ open, openSidebar }: ChatChannelProps) => {
    const searchParamas = useSearchParams()
    const queryUser = searchParamas.get("user")
    const { userId } = useAuth()
    const { client, setActiveChannel } = useChatContext();

    useEffect(() => {
        const fetchChannels = async () => {
            if (!queryUser || !userId) return;

            try {
                const {user} = await getUserByClerkId(queryUser)
                const channel = client.channel("messaging", {
                    members: [queryUser, userId],
                    name: user.name
                })
                await channel.create();
                setActiveChannel(channel)
            } catch (error) {
                console.error("Error fetching channels:", error);
            }
        };

        fetchChannels();
    }, [queryUser, userId]);


    return (
        <div className={cn("w-full md:block", !open && "hidden")}>
            <Channel>
                <Window>
                    <CustomChannelHeader openSidebar={openSidebar} />
                    <MessageList />
                    <MessageInput />
                </Window>
            </Channel>
        </div>
    )
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
    openSidebar: () => void;
}

function CustomChannelHeader({
    openSidebar,
    ...props
}: CustomChannelHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-full p-2 md:hidden">
                <Button size="icon" variant="ghost" onClick={openSidebar}>
                    <Menu className="size-5" />
                </Button>
            </div>
            <ChannelHeader {...props} />
        </div>
    );
}