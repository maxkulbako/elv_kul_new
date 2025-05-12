"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { tokenProvider } from "@/lib/actions/stream.action";
import { useSession } from "next-auth/react";
import LoaderUI from "@/components/shared/LoaderUI";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export const StreamClientProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || videoClient) return;

    const userId = session?.user?.id;
    const userName = session?.user?.name || session?.user?.id;
    const userImage = session?.user?.image || "";

    if (!userId || !apiKey) {
      console.log("Missing userId or apiKey", { userId, apiKey });
      return;
    }

    const user: User = {
      id: userId,
      name: userName,
      image: userImage,
    };

    const myClient = new StreamVideoClient({
      apiKey,
      user,
      tokenProvider,
    });

    setVideoClient(myClient);
  }, [status, session]);

  if (!videoClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderUI text="Loading..." />
      </div>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
