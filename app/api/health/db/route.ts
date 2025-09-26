import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe("SELECT 1 as ok");
    return NextResponse.json({ ok: true, result });
  } catch (error: unknown) {
    console.error("DB HEALTH ERROR:", error);
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}


