import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const createLinkSchema = z.object({
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
  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter." })
    .max(50, { message: "Slug maksimal 50 karakter." })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Slug hanya boleh berisi huruf, angka, dan strip (-).",
    }),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createLinkSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data tidak valid.";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { urlAsli, slug, lembaga, password } = parsed.data;
    const expectedPassword = process.env.ADMIN_EDIT_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { message: "ADMIN_EDIT_PASSWORD belum dikonfigurasi." },
        { status: 500 },
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { message: "Hanya admin BEM yang diperbolehkan membuat link." },
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

    const { error } = await supabase.from("links").insert([
      {
        url_asli: finalUrl,
        slug,
        lembaga,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Slug ini sudah digunakan. Silakan pilih slug lain." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { message: `Gagal membuat link: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Berhasil membuat link." });
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memproses pembuatan link." },
      { status: 500 },
    );
  }
}
