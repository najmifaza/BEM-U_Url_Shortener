"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { AdminPasswordDialog } from "@/components/AdminPasswordDialog";

export default function DatabaseAccessGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleVerify = async () => {
    if (!password) {
      toast.error("Password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/links/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload?.message || "Password tidak valid.");
        return;
      }

      setPassword("");
      setIsDialogOpen(false);
      toast.success("Akses database dibuka.");
      router.refresh();
    } catch {
      toast.error("Gagal memverifikasi password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-start sm:items-center justify-center p-4 pt-10 sm:pt-4 overflow-hidden font-sans">
      <div className="absolute inset-0 z-10 bg-zinc-50/0 dark:bg-zinc-950/80 pointer-events-none" />

      <GlassCard className="relative z-20 flex flex-col backdrop-blur-md shadow-2xl rounded-3xl p-8 border w-full max-w-xl">
        <div className="flex justify-center mb-3">
          <Image
            className="dark:invert"
            src="/KabinetKausaCipta.webp"
            alt="BEM-U logo"
            width={65}
            height={12}
            priority
          />
        </div>

        <div className="w-full space-y-4 text-center sm:text-left">
          <h2 className="font-bold text-2xl text-zinc-50 text-center">
            Database Dilindungi
          </h2>
          <p className="text-sm text-white/70 text-center">
            Masukkan password admin untuk membuka halaman database.
          </p>
          <div className="flex justify-center pt-2">
            <GlassButton type="button" onClick={() => setIsDialogOpen(true)}>
              Buka Verifikasi
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      <AdminPasswordDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        password={password}
        onPasswordChange={setPassword}
        onConfirm={handleVerify}
        title="Verifikasi Admin"
        description="Masukkan password admin untuk membuka data database."
        confirmLabel="Masuk"
        loadingLabel="Memverifikasi..."
        loading={loading}
        inputId="database-admin-password"
      />
    </div>
  );
}
