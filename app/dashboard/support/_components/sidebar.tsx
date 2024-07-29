"use client"

import { useUser } from "@clerk/nextjs"
import { MailPlus, X } from "lucide-react"
import { useCallback, useState } from "react"
import { ChannelList, ChannelPreviewMessenger, ChannelPreviewUIComponentProps } from "stream-chat-react"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

interface ChatSidebarProps {
    open: boolean;
    onClose: () => void;
}

export const Sidebar = ({ open, onClose }: ChatSidebarProps) => {
    const { user } = useUser()

    const ChannelPreviewCustom = useCallback(
        (props: ChannelPreviewUIComponentProps) => (
            <ChannelPreviewMessenger
                {...props}
                onSelect={() => {
                    props.setActiveChannel?.(props.channel, props.watchers);
                    onClose();
                }}
            />
        ),
        [onClose],
    );

    return (
        <div
            className={cn(
                "size-full flex-col border-e md:flex md:w-72",
                open ? "flex" : "hidden",
            )}
        >
            <MenuHeader onClose={onClose} />
            <ChannelList
                filters={{
                    type: "messaging",
                    members: { $in: [user?.id || ""] },
                }}
                showChannelSearch
                options={{ state: true, presence: true, limit: 8 }}
                sort={{ last_message_at: -1 }}
                additionalChannelSearchProps={{
                    searchForChannels: true,
                    searchQueryParams: {
                        channelFilters: {
                            filters: { members: { $in: [user?.id || ""] } },
                        },
                    },
                }}
                Preview={ChannelPreviewCustom}
            />
        </div>
    )
}

interface MenuHeaderProps {
    onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
    return (
        <>
            <div className="flex items-center gap-3 p-2">
                <div className="h-full md:hidden">
                    <Button size="icon" variant="ghost" onClick={onClose}>
                        <X className="size-5" />
                    </Button>
                </div>
                <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
            </div>
        </>
    )
}