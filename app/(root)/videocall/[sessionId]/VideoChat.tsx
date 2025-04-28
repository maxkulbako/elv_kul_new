"use client";

import {
  RefObject,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  useCallback,
} from "react";
import ZoomVideo, {
  type VideoClient,
  VideoQuality,
  type VideoPlayer,
} from "@zoom/videosdk";
import { WorkAroundForSafari } from "@/lib/utils/utils";
import { PhoneOff, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useRouter } from "next/navigation";

type ZoomClient = ReturnType<typeof ZoomVideo.createClient>;

const MicButton = (props: {
  client: RefObject<typeof VideoClient>;
  isAudioMuted: boolean;
  setIsAudioMuted: Dispatch<SetStateAction<boolean>>;
}) => {
  const { client, isAudioMuted, setIsAudioMuted } = props;
  const onMicrophoneClick = async () => {
    const mediaStream = client.current.getMediaStream();
    if (isAudioMuted) {
      await mediaStream?.unmuteAudio();
    } else {
      await mediaStream?.muteAudio();
    }
    setIsAudioMuted(client.current.getCurrentUserInfo().muted ?? true);
  };
  return (
    <button
      onClick={onMicrophoneClick}
      title="microphone"
      className="rounded-full bg-white p-2"
    >
      {isAudioMuted ? <MicOff /> : <Mic />}
    </button>
  );
};

const CameraButton = (props: {
  client: RefObject<typeof VideoClient>;
  isVideoMuted: boolean;
  setIsVideoMuted: Dispatch<SetStateAction<boolean>>;
  renderVideo: (event: {
    action: "Start" | "Stop";
    userId: number;
  }) => Promise<void>;
}) => {
  const { client, isVideoMuted, setIsVideoMuted, renderVideo } = props;

  const onCameraClick = async () => {
    const mediaStream = client.current.getMediaStream();
    if (isVideoMuted) {
      await mediaStream.startVideo();
      setIsVideoMuted(false);
      await renderVideo({
        action: "Start",
        userId: client.current.getCurrentUserInfo().userId,
      });
    } else {
      await mediaStream.stopVideo();
      setIsVideoMuted(true);
      await renderVideo({
        action: "Stop",
        userId: client.current.getCurrentUserInfo().userId,
      });
    }
  };

  return (
    <button
      onClick={onCameraClick}
      title="camera"
      className="rounded-full bg-white p-2"
    >
      {isVideoMuted ? <VideoOff /> : <Video />}
    </button>
  );
};

const VideoChat = ({
  sessionId,
  zoomToken,
  userName,
}: {
  sessionId: string;
  zoomToken: string;
  userName: string;
}) => {
  const [inSession, setInSession] = useState(false);
  const client = useRef<ZoomClient | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(
    !client.current?.getCurrentUserInfo()?.bVideoOn,
  );
  const [isAudioMuted, setIsAudioMuted] = useState(
    client.current?.getCurrentUserInfo()?.muted ?? true,
  );
  const selfIdRef = useRef<number | null>(null);

  const router = useRouter();

  const mainRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderVideo = useCallback(
    async (event: { action: "Start" | "Stop"; userId: number }) => {
      if (!client.current) return;
      const media = client.current.getMediaStream();
      const isSelf = event.userId === selfIdRef.current;
      const container = isSelf ? pipRef.current : mainRef.current;
      if (!container) return;

      try {
        if (event.action === "Stop") {
          const nodes = await media.detachVideo(event.userId);
          (Array.isArray(nodes) ? nodes : [nodes]).forEach((n) => {
            if (container.contains(n)) {
              container.removeChild(n);
            }
          });
        } else {
          const node = await media.attachVideo(
            event.userId,
            VideoQuality.Video_1080P,
          );

          container.appendChild(node as VideoPlayer);

          let videoElement: HTMLVideoElement | null = null;

          if (node instanceof HTMLVideoElement) {
            videoElement = node;
          } else if (node instanceof HTMLElement) {
            node.style.width = "100%";
            node.style.height = "100%";
            videoElement = node.querySelector("video");
          }

          if (videoElement) {
            videoElement.style.width = "100%";
            videoElement.style.height = "100%";
            videoElement.style.objectFit = isSelf ? "cover" : "contain";
          } else {
            console.warn("Не вдалося знайти <video> елемент", node);
          }
        }
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "EmptyError" &&
          err.message !== "INVALID_OPERATION"
        ) {
          console.error("Render video error:", err);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!client.current) {
      client.current = ZoomVideo.createClient();
    }
    const currentClient = client.current;

    const stableRenderVideo = renderVideo;
    currentClient.on("peer-video-state-change", stableRenderVideo);

    return () => {
      currentClient?.off("peer-video-state-change", stableRenderVideo);
      if (currentClient?.getSessionInfo()?.isInMeeting) {
        currentClient?.leave();
      }
    };
  }, [renderVideo]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const joinSession = async () => {
    if (!client.current) return;

    try {
      await client.current.init("en-US", "Global", { patchJsMedia: true });
      await client.current.join(sessionId, zoomToken, userName).catch((e) => {
        console.log(e);
      });
      const info = client.current!.getCurrentUserInfo();
      if (!info) {
        console.error("Could not get user info after join");
        setInSession(false);
        return;
      }
      selfIdRef.current = info.userId;
      setInSession(true);
      const mediaStream = client.current.getMediaStream();
      // @ts-expect-error Safari check
      if (window.safari) {
        await WorkAroundForSafari(client.current);
      } else {
        await mediaStream.startAudio();
      }
      setIsAudioMuted(client.current.getCurrentUserInfo().muted ?? true);
      await mediaStream.startVideo();
      setIsVideoMuted(!client.current.getCurrentUserInfo().bVideoOn);
      await renderVideo({ action: "Start", userId: info.userId });
    } catch (error) {
      console.log("error in joinSession", error);
      setInSession(false);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen API error:", error);
      setIsFullscreen(!!document.fullscreenElement);
    }
  };

  const leaveSession = async () => {
    const stableRenderVideo = renderVideo;
    client.current?.off("peer-video-state-change", stableRenderVideo);
    await client.current?.leave().catch((e) => console.log("leave error", e));
    router.push("/");
  };

  return (
    <div
      ref={containerRef}
      className="relative max-w-screen-md h-[500px] mx-auto  bg-black rounded-md overflow-hidden "
    >
      <div
        ref={mainRef}
        className={inSession ? "w-full aspect-video" : "hidden"}
      />

      <div
        ref={pipRef}
        className={`absolute bottom-20 right-4 w-32 h-32 md:w-40 md:h-40 border-2 border-white rounded-md overflow-hidden shadow-lg aspect-square z-10 ${
          inSession ? "" : "hidden"
        }`}
      />
      {!inSession ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex w-64 flex-col items-center">
            <div className="h-4" />
            <Button
              className="w-full"
              onClick={joinSession}
              title="join session"
            >
              Join
            </Button>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex w-auto max-w-[90%] justify-center items-center space-x-3 md:space-x-4 p-2 md:p-3 bg-black bg-opacity-50 rounded-full shadow-lg">
          <CameraButton
            client={client as RefObject<typeof VideoClient>}
            isVideoMuted={isVideoMuted}
            setIsVideoMuted={setIsVideoMuted}
            renderVideo={renderVideo}
          />
          <MicButton
            client={client as RefObject<typeof VideoClient>}
            isAudioMuted={isAudioMuted}
            setIsAudioMuted={setIsAudioMuted}
          />
          <button
            onClick={toggleFullscreen}
            title={
              isFullscreen
                ? "Вийти з повноекранного режиму"
                : "Повноекранний режим"
            }
            className="rounded-full bg-white p-2 text-black hover:bg-gray-200 transition-colors"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={leaveSession}
            title="leave session"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoChat;
