import { supabase } from "@/lib/supabase";
import DatabaseClient from "@/components/DatabaseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Database() {
  const { data: links, error } = await supabase
    .from("links")
    .select("id, lembaga, slug, url_asli, jumlah_klik, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data:", error.message);
    return (
      <div className="text-white text-center mt-20">Gagal memuat data.</div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen items-start sm:items-center justify-center
             p-4 pt-10 sm:pt-4 overflow-hidden font-sans"
    >
      <div
        className="absolute inset-0 z-10 bg-zinc-50/0 dark:bg-zinc-950/80
                pointer-events-none"
      />
      <DatabaseClient initialLinks={links || []} />
    </div>
  );
}
