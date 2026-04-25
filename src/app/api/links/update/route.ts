import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const updateLinkSchema = z.object({
  id: z.string().min(1, { message: "ID link tidak valid." }),
  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter." })
    .max(50, { message: "Slug maksimal 50 karakter." })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Slug hanya boleh berisi huruf, angka, dan strip (-).",
    }),
  urlAsli: z
    .string()
    .min(1, { message: "URL Asli tidak boleh kosong." })
    .regex(
      /^(?:(?:https?:\/\/)?(?:www\.)?)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s]*)?$/,
      {
        message:
          "Format URL tidak valid (contoh: google.com atau https://google.com)",
      },
    ),
  lembaga: z.string().min(1, { message: "Silakan pilih lembaga." }),
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateLinkSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data tidak valid.";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { id, slug, urlAsli, lembaga, password } = parsed.data;
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

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { message: "Konfigurasi Supabase di server belum lengkap." },
        { status: 500 },
      );
    }

    const finalUrl = /^https?:\/\//i.test(urlAsli)
      ? urlAsli
      : `https://${urlAsli}`;

    const { data: duplicate, error: duplicateError } = await supabase
      .from("links")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .limit(1)
      .maybeSingle();

    if (duplicateError) {
      return NextResponse.json(
        { message: `Gagal memeriksa slug: ${duplicateError.message}` },
        { status: 500 },
      );
    }

    if (duplicate) {
      return NextResponse.json(
        { message: "Slug ini sudah digunakan. Silakan pilih slug lain." },
        { status: 409 },
      );
    }

    const { data: updatedLink, error: updateError } = await supabase
      .from("links")
      .update({
        slug,
        url_asli: finalUrl,
        lembaga,
      })
      .eq("id", id)
      .select("id, lembaga, slug, url_asli, jumlah_klik, created_at")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        { message: `Gagal memperbarui link: ${updateError.message}` },
        { status: 500 },
      );
    }

    if (!updatedLink) {
      return NextResponse.json(
        { message: "Data link tidak ditemukan atau tidak bisa diperbarui." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Berhasil", link: updatedLink });
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memproses update." },
      { status: 500 },
    );
  }
}
