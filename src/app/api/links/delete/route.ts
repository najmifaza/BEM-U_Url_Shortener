import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const deleteLinkSchema = z.object({
  id: z.string().min(1, { message: "ID link tidak valid." }),
  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter." })
    .max(50, { message: "Slug maksimal 50 karakter." })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Slug hanya boleh berisi huruf, angka, dan strip (-).",
    }),
  confirmationSlug: z
    .string()
    .min(1, { message: "Konfirmasi slug wajib diisi." }),
  password: z.string().min(1, { message: "Password wajib diisi." }),
});

const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey || anonKey || "");
};

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = deleteLinkSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data tidak valid.";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { id, slug, confirmationSlug, password } = parsed.data;
    const expectedPassword = process.env.SUPER_ADMIN_EDIT_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { message: "SUPER_ADMIN_EDIT_PASSWORD belum dikonfigurasi." },
        { status: 500 },
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { message: "Password super admin salah." },
        { status: 401 },
      );
    }

    if (confirmationSlug !== slug) {
      return NextResponse.json(
        { message: "Slug konfirmasi tidak sesuai." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { message: "Konfigurasi Supabase di server belum lengkap." },
        { status: 500 },
      );
    }

    const { data: existingLink, error: checkError } = await supabase
      .from("links")
      .select("id, slug")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json(
        { message: `Gagal memeriksa data link: ${checkError.message}` },
        { status: 500 },
      );
    }

    if (!existingLink) {
      return NextResponse.json(
        { message: "Data link tidak ditemukan." },
        { status: 404 },
      );
    }

    if (existingLink.slug !== slug) {
      return NextResponse.json(
        { message: "Slug tidak sesuai dengan data yang dipilih." },
        { status: 400 },
      );
    }

    const { error: deleteError } = await supabase
      .from("links")
      .delete()
      .eq("id", id)
      .eq("slug", slug);

    if (deleteError) {
      return NextResponse.json(
        { message: `Gagal menghapus link: ${deleteError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Berhasil menghapus link." });
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memproses delete." },
      { status: 500 },
    );
  }
}
