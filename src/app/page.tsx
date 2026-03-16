"use client";

import ShortLinkForm from "@/components/ShortLinkForm";

export default function Home() {
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
      <main className="w-full max-w-md relative z-20">
        {" "}
        <ShortLinkForm></ShortLinkForm>
      </main>
    </div>
  );
}
