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
  lembaga: z
    .string({
      required_error: "Silakan pilih lembaga.",
    })
    .min(1, "Silakan pilih lembaga."),
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
      const fullUrl = `${window.location.origin}/${data.slug}`;
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
       shadow-2xl rounded-3xl p-8 border bg-white/30 "
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
        <h2 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50 text-center">
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
            <Input
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
              <span className="text-black  text-sm">/</span>
              <Input
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
            <Select onValueChange={(value) => setValue("lembaga", value)}>
              <SelectTrigger
                className={`w-full ${errors.lembaga ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Pilih kementrian atau biro" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kementerian / Biro</SelectLabel>
                  <SelectItem value="Biro Keuangan">Biro Keuangan</SelectItem>
                  <SelectItem value="Biro Kesekretariatan">
                    Biro Kesekretariatan
                  </SelectItem>
                  <SelectItem value="Biro Pengendali dan Penjamin Mutu">
                    Biro Pengendali dan Penjamin Mutu
                  </SelectItem>
                  <SelectItem value="Biro Satuan Pengawas Internal">
                    Biro Satuan Pengawas Internal
                  </SelectItem>
                  <SelectItem value="Biro Pengembangan Sumber Daya Anggota">
                    Biro Pengembangan Sumber Daya Anggota
                  </SelectItem>
                  <SelectItem value="Kementerian Advokasi Kesejahteraan Mahasiswa">
                    Kementerian Advokasi Kesejahteraan Mahasiswa
                  </SelectItem>
                  <SelectItem value="Kementerian Aksi dan Propaganda">
                    Kementerian Aksi dan Propaganda
                  </SelectItem>
                  <SelectItem value="Kementerian Analisis Isu Strategis">
                    Kementerian Analisis Isu Strategis
                  </SelectItem>
                  <SelectItem value="Kementerian Pemberdayaan Perempuan">
                    Kementerian Pemberdayaan Perempuan
                  </SelectItem>
                  <SelectItem value="Kementerian Pengembangan Sumber Daya Mahasiswa">
                    Kementerian Pengembangan Sumber Daya Mahasiswa
                  </SelectItem>
                  <SelectItem value="Kementerian Seni dan Olahraga">
                    Kementerian Seni dan Olahraga
                  </SelectItem>
                  <SelectItem value="Kementerian Prestasi dan Inovasi">
                    Kementerian Prestasi dan Inovasi
                  </SelectItem>
                  <SelectItem value="Kementerian Dalam Negeri">
                    Kementerian Dalam Negeri
                  </SelectItem>
                  <SelectItem value="Kementerian Luar Negeri">
                    Kementerian Luar Negeri
                  </SelectItem>
                  <SelectItem value="Kementerian Pengabdian Masyarakat">
                    Kementerian Pengabdian Masyarakat
                  </SelectItem>
                  <SelectItem value="Kementerian Media Kreatif dan Aplikatif">
                    Kementerian Media Kreatif dan Aplikatif
                  </SelectItem>
                  <SelectItem value="Kementerian Media Komunikasi dan Informasi">
                    Kementerian Media Komunikasi dan Informasi
                  </SelectItem>
                  <SelectItem value="Kementerian Riset dan Data">
                    Kementerian Riset dan Data
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.lembaga && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lembaga.message}
              </p>
            )}
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </div>
    </GlassCard>
  );
}
