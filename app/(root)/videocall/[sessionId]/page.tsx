import { getZoomTokenAction } from "@/lib/actions/zoom.action";
import VideoChatClientWrapper from "./VideoChatClientWrapper";
import { auth } from "@/auth";

const VideoCallPage = async ({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) => {
  const session = await auth();
  const userName = session?.user?.name;
  const { sessionId } = await params;
  const result = await getZoomTokenAction(sessionId);

  if (!result.signature) {
    return <div>No signature</div>;
  }

  return (
    <div className="p-10">
      <VideoChatClientWrapper
        sessionId={sessionId}
        zoomToken={result.signature}
        userName={userName || "User"}
      />
    </div>
  );
};

export default VideoCallPage;
