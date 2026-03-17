import { ArrowUpRight, CirclePlay, Instagram } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassButton } from "@/components/ui/glass-button";

export default function Hero() {
  return (
    <div className="dark">
      <div className="flex min-h-screen items-center justify-center px-6 ">
        <div className="relative z-10 max-w-3xl text-center">
          <GlassBadge asChild className="rounded-full border-border py-1 ">
            <Link href="#" className="inline-flex items-center">
              Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </GlassBadge>
          <h1 className="text-white/80 mt-6 font-semibold text-4xl tracking-tighter sm:text-5xl md:text-6xl md:leading-[1.2] lg:text-7xl">
            Bikin Link Proker <br />
            Nggak Ribet Lagi
          </h1>
          <p className="mt-6 text-foreground/80 md:text-lg">
            Ubah URL panjang yang rumit menjadi tautan pendek yang rapi dan
            mudah dibagikan. Kelola semua tautan Anda dalam satu dashboard
            modern yang elegan.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <GlassButton size="lg" asChild>
              <Link
                href="/shortener"
                className="inline-flex items-center gap-2"
              >
                Get Started <ArrowUpRight className="h-5! w-5!" />
              </Link>
            </GlassButton>
            <GlassButton
              className=" text-base shadow-none"
              size="lg"
              variant="outline"
            >
              <a
                href="https://www.instagram.com/nakomisme/"
                target="_blank"
                className="inline-flex gap-2 items-center"
              >
                <Instagram className="h-5! w-5!" /> Nakoms Instagram
              </a>
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
}
