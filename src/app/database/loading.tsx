import {
  GlassTable,
  GlassTableBody,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  GlassTableHead,
} from "@/components/glass-table";

export default function Loading() {
  return (
    <div
      className="relative flex min-h-screen items-start sm:items-center justify-center
             p-4 pt-10 sm:pt-4 overflow-hidden font-sans"
    >
      <div
        className="absolute inset-0 z-10 bg-zinc-50/0 dark:bg-zinc-950/80
                pointer-events-none"
      />
      <main className="w-full max-w-2xl relative z-20">
        <GlassTable className="max-h-145 sm:max-h-120 opacity-50">
          <GlassTableHeader>
            <GlassTableRow>
              <GlassTableHead className="w-px whitespace-nowrap">
                Lembaga
              </GlassTableHead>
              <GlassTableHead>Slug</GlassTableHead>
              <GlassTableHead className="text-right w-px whitespace-nowrap">
                Kunjungan
              </GlassTableHead>
              <GlassTableHead className="w-px whitespace-nowrap">
                Tanggal
              </GlassTableHead>
            </GlassTableRow>
          </GlassTableHeader>
          <GlassTableBody>
            {[...Array(5)].map((_, i) => (
              <GlassTableRow key={i} className="animate-pulse">
                <GlassTableCell>
                  <div className="h-4 w-20 bg-white/10 rounded" />
                </GlassTableCell>
                <GlassTableCell>
                  <div className="h-8 w-full bg-white/10 rounded-lg" />
                </GlassTableCell>
                <GlassTableCell>
                  <div className="h-4 w-8 bg-white/10 rounded ml-auto" />
                </GlassTableCell>
                <GlassTableCell>
                  <div className="h-4 w-16 bg-white/10 rounded" />
                </GlassTableCell>
              </GlassTableRow>
            ))}
          </GlassTableBody>
        </GlassTable>
      </main>
    </div>
  );
}
