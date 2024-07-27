"use client";

import "@knocklabs/react/dist/index.css";
import { KnockProvider, KnockFeedProvider } from "@knocklabs/react";

interface Props {
    children: React.ReactNode,
    userId: string;
}

export function AppKnockProviders({ children, userId }: Props) {
    const apiKey = process.env.NEXT_PUBLIC_KNOCK_API_KEY || '';
    const feedId = process.env.NEXT_PUBLIC_KNOCK_FEED_ID || '';

    return (
        <KnockProvider
            apiKey={apiKey}
            userId={userId}
        >
            <KnockFeedProvider feedId={feedId}>
                {children}
            </KnockFeedProvider>
        </KnockProvider>
    );
}