import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  DATABASE_ACCESS_COOKIE_NAME,
  DATABASE_ACCESS_MAX_AGE,
  getDatabaseAccessToken,
} from "@/lib/admin-auth";

const verifyPasswordSchema = z.object({
  password: z.string().min(1, { message: "Password wajib diisi." }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifyPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data tidak valid.";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const expectedPassword = process.env.ADMIN_EDIT_PASSWORD;
    if (!expectedPassword) {
      return NextResponse.json(
        { message: "ADMIN_EDIT_PASSWORD belum dikonfigurasi." },
        { status: 500 },
      );
    }

    if (parsed.data.password !== expectedPassword) {
      return NextResponse.json(
        { message: "Password admin salah." },
        { status: 401 },
      );
    }

    const accessToken = getDatabaseAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { message: "ADMIN_EDIT_PASSWORD belum dikonfigurasi." },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ message: "Password valid." });
    response.cookies.set({
      name: DATABASE_ACCESS_COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DATABASE_ACCESS_MAX_AGE,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat verifikasi password." },
      { status: 500 },
    );
  }
}
