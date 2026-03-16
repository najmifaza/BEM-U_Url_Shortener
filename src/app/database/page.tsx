import { GlassScrollArea } from "@/components/glass-scroll-area";
import {
  GlassTable,
  GlassTableBody,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  GlassTableHead,
} from "@/components/glass-table";
import { GlassButton } from "@/components/ui/glass-button";
import { supabase } from "@/lib/supabase";

export default async function Database() {
  const { data: links, error } = await supabase
    .from("links")
    .select("*")
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
      {/* LAYER 3: Form Utama (Paling Atas) */}
      <main className="w-full max-w-2xl relative z-20">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Data Link Shortener
        </h1>

        <GlassTable className="max-h-95 sm: max-h-120 ">
          <GlassTableHeader>
            <GlassTableRow>
              <GlassTableHead>Lembaga</GlassTableHead>
              <GlassTableHead>Slug</GlassTableHead>
              <GlassTableHead>Tanggal</GlassTableHead>
              <GlassTableHead className="text-right">Klik</GlassTableHead>
            </GlassTableRow>
          </GlassTableHeader>{" "}
          <GlassTableBody>
            {links?.map((link) => (
              <GlassTableRow key={link.id}>
                <GlassTableCell className="font-medium">
                  {link.lembaga || "Umum"}
                </GlassTableCell>
                <GlassTableCell>
                  <GlassButton size="sm" variant="outline">
                    {link.slug}
                  </GlassButton>
                </GlassTableCell>
                <GlassTableCell className="text-xs opacity-60">
                  {/* Format tanggal agar mudah dibaca */}
                  {new Date(link.created_at).toLocaleDateString("id-ID")}
                </GlassTableCell>
                <GlassTableCell className="text-right  font-bold">
                  {link.jumlah_klik || 0}
                </GlassTableCell>
              </GlassTableRow>
            ))}
            {/* Tampilkan pesan jika data kosong */}
            {links?.length === 0 && (
              <GlassTableRow>
                <GlassTableCell
                  colSpan={4}
                  className="text-center py-10 opacity-50"
                >
                  Belum ada link yang dibuat.
                </GlassTableCell>
              </GlassTableRow>
            )}
          </GlassTableBody>{" "}
        </GlassTable>
      </main>
    </div>
  );
}
