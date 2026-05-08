"use client";
import { ArrowUpRight, Instagram } from "lucide-react";
import Link from "next/link";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassButton } from "@/components/ui/glass-button";
import BlurText from "@/components/BlurText";
import Image from "next/image";
export default function Hero() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <div className="dark">
      <div
        className="flex min-h-screen items-start sm:items-center justify-center 
  pt-30 sm:pt-0 scale-[0.87] sm:scale-100 origin-top"
      >
        <div className="relative z-10 max-w-4xl text-center  ">
          <GlassBadge asChild className="rounded-full border-border py-1  ">
            {/* <Link href="#" className="inline-flex items-center">
              Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
            </Link> */}
            <Image
              src="/logobem.png"
              alt="Description"
              width={250}
              height={250}
              className="w-40 h-auto sm:w-62.5"
            />
          </GlassBadge>
          <BlurText
            text="Link Proker Kepanjangan? Singkatin Aja di Sini"
            delay={200}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-white/80 mt-6 font-bold  justify-center text-3xl tracking-tighter sm:text-5xl md:text-6xl md:leading-[1.2] lg:text-7xl"
            animationFrom={undefined}
            animationTo={undefined}
          />

          <p className="mt-6 text-foreground/80 md:text-lg">
            Tingkatkan profesionalitas publikasi BEM Unsoed. Ubah URL Google
            Drive atau Form yang panjang menjadi tautan pendek yang tepercaya
            dan enak dilihat di setiap poster acara.
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
