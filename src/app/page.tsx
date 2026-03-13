"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Home() {
  const [urlAsli, setUrlAsli] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Logika simpan ke Supabase akan di sini
    const { data, error } = await supabase
      .from("links")
      .insert([{ url_asli: urlAsli, slug: slug }]);

    if (error) {
      alert("Gagal membuat link: " + error.message);
    } else {
      alert("Link berhasil dibuat!");
      setUrlAsli("");
      setSlug("");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950 p-4">
      <main className="w-full max-w-md">
        {" "}
        <div
          className="flex flex-col bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 border border-zinc-200
      dark:border-zinc-800"
        >
          <div className="flex justify-center mb-8">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={24}
              priority
            />
          </div>
          <div className="w-full space-y-6 text-center sm:text-left">
            {" "}
            <div className="w-full max-w-sm space-y-6">
              <h2 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50 text-center">
                Generate Short Link
              </h2>
              <form onSubmit={handleGenerate} className="space-y-6 text-left">
                <div className="space-y-2">
                  <Label>Real URL</Label>
                  <Input
                    id="url_asli"
                    name="url_asli"
                    type="text"
                    required
                    className="mt-1"
                    placeholder="Enter your long URL"
                    value={urlAsli}
                    onChange={(e) => setUrlAsli(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Short URL</Label>
                  <Input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    placeholder="Custom short name"
                    className="mt-1"
                    value={slug} // Tambahkan baris ini
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          {/* <div className="mt-5 flex flex-col gap-4 text-base font-medium sm:flex-row">
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
              />
              Deploy Now
            </a>
            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </div> */}
        </div>
      </main>
    </div>
  );
}
