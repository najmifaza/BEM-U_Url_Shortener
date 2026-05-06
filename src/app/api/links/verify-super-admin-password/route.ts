import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const verifySuperAdminPasswordSchema = z.object({
  password: z.string().min(1, { message: "Password wajib diisi." }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifySuperAdminPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data tidak valid.";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const expectedPassword = process.env.SUPER_ADMIN_EDIT_PASSWORD;
    if (!expectedPassword) {
      return NextResponse.json(
        { message: "SUPER_ADMIN_EDIT_PASSWORD belum dikonfigurasi." },
        { status: 500 },
      );
    }

    if (parsed.data.password !== expectedPassword) {
      return NextResponse.json(
        { message: "Password super admin salah." },
        { status: 401 },
      );
    }

    return NextResponse.json({ message: "Password valid." });
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat verifikasi password." },
      { status: 500 },
    );
  }
}
