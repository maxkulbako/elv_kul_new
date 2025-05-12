"use server";

import { auth } from "@/auth";
import { StreamClient } from "@stream-io/node-sdk";

export const tokenProvider = async (): Promise<string> => {
  console.log("TokenProvider - Starting token generation");

  const session = await auth();
  console.log("TokenProvider - Auth session:", session);

  const userId = session?.user?.id;
  console.log("TokenProvider - User ID:", userId);

  if (!userId) {
    console.log("TokenProvider - No user ID found");
    throw new Error("User is not logged in");
  }

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_SECRET_KEY;

  console.log("TokenProvider - API Key exists:", !!apiKey);
  console.log("TokenProvider - API Secret exists:", !!apiSecret);

  if (!apiKey || !apiSecret) {
    console.log("TokenProvider - Missing API credentials");
    throw new Error("Stream API key or secret is missing!");
  }

  const serverClient = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 3600; // 1 hour
  const iat = Math.floor(Date.now() / 1000) - 60;

  console.log("TokenProvider - Generating token for user:", userId);

  const token = serverClient.generateUserToken({
    user_id: userId,
    exp,
    iat,
  });

  console.log("TokenProvider - Token generated successfully");
  return token;
};
