import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { PhoneCall } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden font-sans">
      {/* Overlay background agar konten tetap terbaca di atas Grainient */}
      <div className="absolute inset-0 z-10 bg-zinc-950/20 pointer-events-none" />

      <main className="w-full max-w-md relative z-20">
        <GlassCard className="flex flex-col items-center text-center p-10 space-y-6 backdrop-blur-md shadow-2xl rounded-3xl border border-white/10">
          <div className="space-y-2">
            <h1 className="text-8xl font-black text-white/20 animate-pulse">
              404
            </h1>
            <h2 className="text-2xl font-bold text-white">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-white/60 text-sm mb-5">
              Maaf, halaman yang Anda cari tidak ada atau link singkat tersebut
              belum terdaftar. Silahkan hubungi developer di bawah ini.
            </p>
          </div>

          <Link href="https://instagram.com/nakomisme " passHref>
            <GlassButton variant="default" className="">
              Hubungi Developer <PhoneCall className="h-5! w-5! " />
            </GlassButton>
          </Link>
        </GlassCard>
      </main>
    </div>
  );
}
