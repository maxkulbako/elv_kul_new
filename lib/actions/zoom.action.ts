"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";

interface GenerateZoomSignatureResult {
  success: boolean;
  signature?: string; // Це буде наш JWT
  sdkKey?: string;
  message: string;
}

export async function getZoomTokenAction(
  sessionId: string,
): Promise<GenerateZoomSignatureResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Unauthorized: User not logged in." };
  }

  const sdkKey = process.env.ZOOM_VIDEO_SDK_KEY;
  const sdkSecret = process.env.ZOOM_VIDEO_SDK_SECRET;

  if (!sdkKey || !sdkSecret) {
    return {
      success: false,
      message: "Server configuration error: Zoom credentials missing.",
    };
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: sessionId },
      select: { clientId: true, adminId: true }, // <-- Змінено therapistId на adminId
    });

    let role_type = 0 | 1;

    if (appointment?.adminId === userId) {
      role_type = 1; // Host
    } else if (appointment?.clientId === userId) {
      role_type = 0; // Attendee
    } else {
      return {
        success: false,
        message: "Unauthorized: User not in appointment.",
      };
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 2;

    const payload = {
      app_key: sdkKey,
      iat: iat,
      exp: exp,
      tpc: sessionId,
      role_type: role_type,
      user_identity: userId,
      version: 1,
    };

    const signature = jwt.sign(payload, sdkSecret, { algorithm: "HS256" });

    return {
      success: true,
      signature: signature,
      sdkKey: sdkKey,
      message: "Signature generated successfully.",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return {
      success: false,
      message: "Failed to generate Zoom signature due to a server error.",
    };
  }
}
