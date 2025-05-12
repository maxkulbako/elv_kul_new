import VideoChatClient from "./VideoChatClient";

const VideoCallPage = async ({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;

  return (
    <div className="p-0 lg:p-10">
      <VideoChatClient sessionId={sessionId} />
    </div>
  );
};

export default VideoCallPage;
