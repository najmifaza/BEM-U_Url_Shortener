"use client";

import ShortLinkForm from "@/components/ShortLinkForm";
import Grainient from "../components/background/Grainient";

export default function Home() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center p-4
      overflow-hidden font-sans"
    >
      {/* LAYER 1: Gambar Background (Paling Bawah) */}
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B19EEF"
          timeSpeed={1}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.8}
        />
      </div>
      {/* LAYER 2: Overlay Warna (Menutupi Gambar agar form terbaca) */}
      {/* Disini kita menaruh bg-zinc-50 dengan opacity agar gambar
      dibelakangnya terlihat samar */}
      <div
        className="absolute inset-0 z-10 bg-zinc-50/0 dark:bg-zinc-950/80
        pointer-events-none"
      />

      {/* LAYER 3: Form Utama (Paling Atas) */}
      <main className="w-full max-w-md relative z-20">
        {" "}
        <ShortLinkForm></ShortLinkForm>
      </main>
    </div>
  );
}
