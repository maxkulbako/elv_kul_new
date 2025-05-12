import { StreamClientProvider } from "@/app/providers/StreamClientProvider";
import { SessionProvider } from "next-auth/react";

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <StreamClientProvider>{children}</StreamClientProvider>
    </SessionProvider>
  );
}
