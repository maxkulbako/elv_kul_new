"use client";

import { Button } from "@/components/ui/button";
import {
  Call,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useCall,
  useStreamVideoClient,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect, useRef, useState } from "react";
import LoaderUI from "@/components/shared/LoaderUI";
import { useRouter } from "next/navigation";

const VideoChatClient = ({ sessionId }: { sessionId: string }) => {
  const client = useStreamVideoClient();
  const callRef = useRef<Call | null>(null);
  const [call, setCall] = useState<Call>();

  const router = useRouter();

  const [isCreatingCall, setIsCreatingCall] = useState(true);

  useEffect(() => {
    if (!client || !sessionId) return;

    const call = client?.call("default", sessionId);

    if (!call) return;
    callRef.current = call;

    const createCall = async () => {
      try {
        await call.getOrCreate();
        setCall(call);
        setIsCreatingCall(false);
      } catch (error) {
        console.error(error);
      }
    };

    createCall();

    return () => {
      if (callRef.current) {
        callRef.current.camera.disable().catch(() => {});
        callRef.current.microphone.disable().catch(() => {});
        callRef.current.leave().catch(console.error);
        callRef.current = null;
      }
    };
  }, [client, sessionId]);

  if (isCreatingCall) {
    return <LoaderUI text="Creating call..." />;
  }

  if (!call) {
    return (
      <div>
        <p>Call not found</p>
        <Button onClick={() => router.push("/client/dashboard")}>
          Go back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <VideoUI />
    </StreamCall>
  );
};

const VideoUI = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinCall = async () => {
    if (!call) return;
    try {
      setIsJoining(true);
      await call.join();
      setIsJoining(false);
    } catch (error) {
      console.error(error);
      setIsJoining(false);
    }
  };

  if (isJoining && callingState !== CallingState.JOINED) {
    return <LoaderUI text="Joining call..." />;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
      {callingState !== CallingState.JOINED && (
        <Button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onClick={handleJoinCall}
        >
          Join Call
        </Button>
      )}
    </StreamTheme>
  );
};

export default VideoChatClient;
