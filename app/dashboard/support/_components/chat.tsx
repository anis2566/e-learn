"use client"

import { Loader2 } from "lucide-react";
import { Chat } from "stream-chat-react"
import { useTheme } from "next-themes";
import { useState } from "react";

import useInitializeChatClient from "@/hooks/useInitializeStreamClient"
import { Sidebar } from "./sidebar";
import { ChatChannel } from "./chat-channel";

export const ChatPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const chatClient = useInitializeChatClient()
    const { resolvedTheme } = useTheme();



    if (!chatClient) {
        return <Loader2 className="mx-auto my-3 animate-spin" />;
    }

    return (
        <div className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
            <div className="flex w-full">
                <Chat
                    client={chatClient}
                    theme={
                        resolvedTheme === "dark"
                            ? "str-chat__theme-dark"
                            : "str-chat__theme-light"
                    }
                >
                    <Sidebar
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                    <ChatChannel
                        open={!sidebarOpen}
                        openSidebar={() => setSidebarOpen(true)}
                    />
                </Chat>
            </div>
        </div>
    )
}