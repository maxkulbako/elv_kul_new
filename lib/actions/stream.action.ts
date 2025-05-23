"use server";

import { auth } from "@/auth";
import { StreamClient } from "@stream-io/node-sdk";

export const tokenProvider = async (): Promise<string> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.log("TokenProvider - No user ID found");
    throw new Error("User is not logged in");
  }

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_SECRET_KEY;

  if (!apiKey || !apiSecret) {
    console.log("TokenProvider - Missing API credentials");
    throw new Error("Stream API key or secret is missing!");
  }

  const serverClient = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 3600; // 1 hour
  const iat = Math.floor(Date.now() / 1000) - 60;

  const token = serverClient.generateUserToken({
    user_id: userId,
    exp,
    iat,
  });
  return token;
};
