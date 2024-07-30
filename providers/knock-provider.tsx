"use client";

import "@knocklabs/react/dist/index.css";
import { KnockProvider, KnockFeedProvider } from "@knocklabs/react";
import { useUser } from "@/hooks/use-user";
import { Loader } from "lucide-react";

interface Props {
    children: React.ReactNode,
}

export function AppKnockProviders({ children }: Props) {
    const apiKey = process.env.NEXT_PUBLIC_KNOCK_API_KEY!;
    const feedId = process.env.NEXT_PUBLIC_KNOCK_FEED_ID!;
    const user = useUser()

    if(!user) return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader className="w-5 h-5 animate-spin" />
        </div>
    )

    return (
        <KnockProvider
            apiKey={apiKey}
            userId={user?.id || ""}
        >
            <KnockFeedProvider feedId={feedId}>
                {children}
            </KnockFeedProvider>
        </KnockProvider>
    );
}