import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const vars = {
      AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
      NEXTAUTH_URL: Boolean(process.env.NEXTAUTH_URL),
      DATABASE_URL: Boolean(process.env.DATABASE_URL),
    };
    // Include small hints like length to detect trailing spaces without leaking secrets
    const hints = {
      AUTH_SECRET_len: process.env.AUTH_SECRET?.length || 0,
      NEXTAUTH_URL_len: process.env.NEXTAUTH_URL?.length || 0,
      DATABASE_URL_len: process.env.DATABASE_URL?.length || 0,
    };
    return NextResponse.json({ ok: true, vars, hints });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
