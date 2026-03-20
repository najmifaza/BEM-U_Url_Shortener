import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
// 1. Import Zod dan React Hook Form
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassTable } from "./glass-table";
import {
  GlassSelect,
  GlassSelectContent,
  GlassSelectGroup,
  GlassSelectItem,
  GlassSelectLabel,
  GlassSelectTrigger,
  GlassSelectValue,
} from "./glass-select";
import { GlassInput } from "./ui/glass-input";
import { GlassButton } from "./ui/glass-button";
import { LEMBAGA_LIST } from "@/lib/constants";
// 2. Buat Skema Validasi Zod (Sangat Ketat & Profesional)
const formSchema = z.object({
  urlAsli: z.string().min(1, { message: "URL Asli tidak boleh kosong." }).url({
    message: "Format tidak valid. Harus diawali http:// atau https://",
  }),
  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter." })
    .max(20, { message: "Slug maksimal 20 karakter." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug hanya boleh berisi huruf kecil, angka, dan strip (-).",
    }),
  lembaga: z.string().min(1, { message: "Silakan pilih lembaga." }),
});

// Infer type dari schema
type FormData = z.infer<typeof formSchema>;

export default function ShortLinkForm() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [shortUrl, setShortUrl] = useState(""); // Untuk menyimpan URL lengkap yang akan di-copy
  const [copied, setCopied] = useState(false);
  // 3. Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urlAsli: "",
      slug: "",
      lembaga: "",
    },
  });

  // 4. Fungsi Submit yang baru (Data sudah PASTI valid saat masuk ke sini)
  const onSubmit = async (data: FormData) => {
    const passwordInput = window.prompt(
      "Masukkan Password Admin untuk membuat link:",
    );

    // 2. Cek apakah password benar (Silakan ganti 'admin123' dengan password keinginan Anda)
    if (passwordInput !== "ditjenwebganteng") {
      alert("Password Salah! Anda tidak memiliki akses.");
      return; // Berhenti di sini, jangan lanjut simpan ke database
    }

    setLoading(true);
    setSuccessMessage(""); // Reset pesan sukses

    // Simpan ke Supabase
    const { error } = await supabase
      .from("links")
      .insert([
        { url_asli: data.urlAsli, slug: data.slug, lembaga: data.lembaga },
      ]);

    if (error) {
      // Cek apakah error karena slug sudah dipakai (Error code unik di PostgreSQL biasanya 23505)
      if (error.code === "23505") {
        alert("Gagal: Slug ini sudah digunakan. Silakan pilih slug lain.");
      } else {
        alert("Gagal membuat link: " + error.message);
      }
    } else {
      const fullUrl = `bem-unsoed.com/${data.slug}`;
      setShortUrl(fullUrl); // Simpan URL lengkap ke state
      setSuccessMessage(`Berhasil! Link Anda sudah siap.`); // Pesan sukses singkat saja
      reset();
    }
    setLoading(false);
  };
  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);

      // Kembalikan tulisan tombol ke "Copy" setelah 2 detik
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <GlassCard
      className="flex flex-col  backdrop-blur-md
       shadow-2xl rounded-3xl p-8 border "
    >
      <div className="flex justify-center mb-3">
        <Image
          className="dark:invert"
          src="/logo.svg"
          alt="BEM-U logo"
          width={120}
          height={24}
          priority
        />
      </div>

      <div className="w-full space-y-6 text-center sm:text-left">
        <h2 className="font-bold text-2xl text-zinc-50 dark:text-zinc-50 text-center">
          Generate Short Link
        </h2>

        {successMessage && (
          <div
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl
      space-y-3"
          >
            <p className="text-sm font-medium text-green-800 dark:text-green-300 text-center">
              {successMessage}
            </p>

            <div
              className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-200
      dark:border-zinc-700"
            >
              <code className="flex-1 text-xs truncate text-zinc-600 dark:text-zinc-400 px-1">
                {shortUrl}
              </code>
              <Button
                type="button"
                size="sm"
                variant={copied ? "default" : "outline"}
                className="h-8 text-xs px-3 transition-all"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        {/* Hubungkan form dengan handleSubmit dari React Hook Form */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div className="space-y-2">
            <Label htmlFor="urlAsli">Real URL</Label>
            <GlassInput
              id="urlAsli"
              type="text"
              placeholder="https://contoh.com/artikel-sangat-panjang"
              {...register("urlAsli")} // Pengganti value & onChange
              className={errors.urlAsli ? "border-red-500" : ""}
            />
            {/* Tampilkan pesan error Zod jika ada */}
            {errors.urlAsli && (
              <p className="text-sm text-red-500 mt-1">
                {errors.urlAsli.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Short URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-white  text-sm">/</span>
              <GlassInput
                id="slug"
                type="text"
                placeholder="oprec-bem-unsoed"
                {...register("slug")} // Pengganti value & onChange
                className={errors.slug ? "border-red-500" : ""}
              />
            </div>
            {/* Tampilkan pesan error Zod jika ada */}
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="Kementrian">Lembaga</Label>
            <GlassSelect onValueChange={(value) => setValue("lembaga", value)}>
              <GlassSelectTrigger
                className={`w-full ${errors.lembaga ? "border-red-500" : ""}`}
              >
                <GlassSelectValue placeholder="Pilih kementrian atau biro" />
              </GlassSelectTrigger>
              <GlassSelectContent>
                <GlassSelectGroup>
                  <GlassSelectLabel>Kementerian / Biro</GlassSelectLabel>
                  {LEMBAGA_LIST.map((lembaga) => (
                    <GlassSelectItem key={lembaga} value={lembaga}>
                      {lembaga}
                    </GlassSelectItem>
                  ))}
                </GlassSelectGroup>
              </GlassSelectContent>
            </GlassSelect>
            {errors.lembaga && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lembaga.message}
              </p>
            )}
          </div>
          <div>
            <GlassButton
              variant="default"
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </GlassButton>
          </div>
        </form>
      </div>
    </GlassCard>
  );
}
