"use client";
import dynamic from "next/dynamic";

const VideoChat = dynamic<{
  sessionId: string;
  zoomToken: string;
  userName: string;
}>(() => import("./VideoChat"), { ssr: false });

const VideoChatClientWrapper = ({
  sessionId,
  zoomToken,
  userName,
}: {
  sessionId: string;
  zoomToken: string;
  userName: string;
}) => {
  return (
    <VideoChat
      sessionId={sessionId}
      zoomToken={zoomToken}
      userName={userName}
    />
  );
};

export default VideoChatClientWrapper;
