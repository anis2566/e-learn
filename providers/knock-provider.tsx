"use client";

import "@knocklabs/react/dist/index.css";
import { KnockProvider, KnockFeedProvider } from "@knocklabs/react";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";

interface Props {
    children: React.ReactNode,
}

export function AppKnockProviders({ children }: Props) {
    const apiKey = process.env.NEXT_PUBLIC_KNOCK_API_KEY!;
    const feedId = process.env.NEXT_PUBLIC_KNOCK_FEED_ID!;
    const user = useUser()

    if (!user) redirect("/sign-in")

    return (
        <KnockProvider
            apiKey={apiKey}
            userId={user.id}
        >
            <KnockFeedProvider feedId={feedId}>
                {children}
            </KnockFeedProvider>
        </KnockProvider>
    );
}