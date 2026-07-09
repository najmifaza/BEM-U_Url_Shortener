import { supabase } from "@/lib/supabase";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    openGraph: {
      images: [],
    },
  };
}

// Tipe data untuk parameter
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RedirectPage({ params }: PageProps) {
  // 1. Tangkap parameter slug dari URL
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 2. Cari di database Supabase: apakah ada slug yang cocok?
  const { data, error } = await supabase
    .from("links")
    .select("url_asli, jumlah_klik")
    .eq("slug", slug)
    .maybeSingle();

  // 3. Jika error atau data tidak ditemukan, tampilkan halaman 404
  if (error || !data) {
    if (error) console.error("Database error:", error.message);
    notFound(); // Ini akan mengarahkan ke halaman 404 kustom
  }
  supabase
    .from("links")
    .update({ jumlah_klik: (data.jumlah_klik || 0) + 1 })
    .eq("slug", slug)
    .then(({ error }) => {
      if (error) console.error("Gagal update klik:", error.message);
    });

  // 4. Jika data ditemukan, lakukan REDIRECT ke URL Asli
  redirect(data.url_asli);
}
