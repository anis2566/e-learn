import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/nextjs";

import kyInstance from "@/lib/ky";

export default function useInitializeChatClient() {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);


  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: user?.id || "",
          username: user?.fullName || "",
          name: user?.fullName || "",
          image: user?.imageUrl || "",
        },
        async () =>
          kyInstance
            .get("/api/stream/token")
            .json<{ token: string }>()
            .then((data) => data.token)
      )
      .catch((error) => console.error("Failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("Connection closed"));
    };
  }, [user?.id, user?.fullName, user?.imageUrl]);

  return chatClient;
}
