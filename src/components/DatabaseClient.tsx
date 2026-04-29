"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GlassTable,
  GlassTableBody,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  GlassTableHead,
} from "@/components/glass-table";
import CopyButton from "@/components/CopyButton";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import {
  GlassSelect,
  GlassSelectContent,
  GlassSelectGroup,
  GlassSelectItem,
  GlassSelectLabel,
  GlassSelectTrigger,
  GlassSelectValue,
} from "@/components/glass-select";
import {
  GlassDialog,
  GlassDialogContent,
  GlassDialogDescription,
  GlassDialogFooter,
  GlassDialogHeader,
  GlassDialogTitle,
} from "@/components/ui/glass-dialog";
import { LEMBAGA_LIST } from "@/lib/constants";
import { toast } from "sonner";

interface Link {
  id: string;
  lembaga: string | null;
  slug: string;
  url_asli: string | null;
  jumlah_klik: number | null;
  created_at: string;
}

interface DatabaseClientProps {
  initialLinks: Link[];
}

const editFormSchema = z.object({
  urlAsli: z
    .string()
    .min(1, { message: "URL Asli tidak boleh kosong." })
    .regex(
      /^(?:(?:https?:\/\/)?(?:www\.)?)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:[\/?#][^\s]*)?$/,
      {
        message:
          "Format URL tidak valid (contoh: google.com atau https://google.com)",
      },
    ),
  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter." })
    .max(50, { message: "Slug maksimal 50 karakter." })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Slug hanya boleh berisi huruf, angka, dan strip (-).",
    }),
  lembaga: z.string().min(1, { message: "Silakan pilih lembaga." }),
});

type EditFormData = z.infer<typeof editFormSchema>;

const getLinkUrlAsli = (link: Link | null) => {
  if (!link) return "";
  const candidate = (link as Link & { urlAsli?: string | null }).urlAsli;
  return link.url_asli || candidate || "";
};

export default function DatabaseClient({ initialLinks }: DatabaseClientProps) {
  const [links, setLinks] = useState(initialLinks);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("waktu");
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [previousUrlAsli, setPreviousUrlAsli] = useState("");
  const [selectedLembaga, setSelectedLembaga] = useState("");
  const [deleteConfirmationSlug, setDeleteConfirmationSlug] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      slug: "",
      urlAsli: "",
      lembaga: "",
    },
  });

  const handleOpenPasswordDialog = (link: Link) => {
    const urlAsliValue = getLinkUrlAsli(link);
    setSelectedLink(link);
    setPreviousUrlAsli(urlAsliValue);
    setSelectedLembaga(link.lembaga || "");
    reset({
      slug: link.slug,
      urlAsli: urlAsliValue,
      lembaga: link.lembaga || "",
    });
    setAdminPassword("");
    setIsPasswordDialogOpen(true);
  };

  const handleVerifyPassword = async () => {
    if (!adminPassword) {
      toast.error("Password wajib diisi.");
      return;
    }

    try {
      const response = await fetch("/api/links/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: adminPassword }),
      });

      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload?.message || "Password tidak valid.");
        return;
      }
    } catch {
      toast.error("Gagal memverifikasi password.");
      return;
    }

    if (!selectedLink) return;

    const urlAsliValue = getLinkUrlAsli(selectedLink);
    const lembagaValue = selectedLink.lembaga || "";

    reset({
      slug: selectedLink.slug,
      urlAsli: urlAsliValue,
      lembaga: lembagaValue,
    });
    setSelectedLembaga(lembagaValue);
    setPreviousUrlAsli(urlAsliValue);
    setIsPasswordDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleEditFormSubmit = async (data: EditFormData) => {
    if (!selectedLink) {
      toast.error("Data link tidak ditemukan.");
      return;
    }

    setIsSubmittingEdit(true);
    try {
      const response = await fetch("/api/links/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedLink.id,
          slug: data.slug,
          urlAsli: data.urlAsli,
          lembaga: data.lembaga,
          password: adminPassword,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload?.message || "Gagal memperbarui link.");
        return;
      }

      const updatedLink = payload?.link as Link;
      if (!updatedLink) {
        toast.error("Respons server tidak valid.");
        return;
      }

      setLinks((prev) =>
        prev.map((link) => (link.id === updatedLink.id ? updatedLink : link)),
      );
      setSelectedLink(updatedLink);
      setPreviousUrlAsli(updatedLink.url_asli || "");
      setIsEditDialogOpen(false);
      toast.success("Link berhasil diperbarui.");
    } catch {
      toast.error("Terjadi gangguan jaringan saat menyimpan perubahan.");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteConfirmationSlug("");
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLink) {
      toast.error("Data link tidak ditemukan.");
      return;
    }

    if (deleteConfirmationSlug !== selectedLink.slug) {
      toast.error("Slug konfirmasi tidak sesuai.");
      return;
    }

    setIsSubmittingDelete(true);
    try {
      const response = await fetch("/api/links/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedLink.id,
          slug: selectedLink.slug,
          confirmationSlug: deleteConfirmationSlug,
          password: adminPassword,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload?.message || "Gagal menghapus link.");
        return;
      }

      setLinks((prev) => prev.filter((link) => link.id !== selectedLink.id));
      setDeleteConfirmationSlug("");
      setIsDeleteDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedLink(null);
      toast.success("Link berhasil dihapus.");
    } catch {
      toast.error("Terjadi gangguan jaringan saat menghapus link.");
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  const filteredLinks = useMemo(
    () =>
      links.filter(
        (link) =>
          link.lembaga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.slug?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [links, searchTerm],
  );

  const sortedLinks = useMemo(() => {
    const sorted = [...filteredLinks];
    if (sortOption === "waktu") {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else if (sortOption === "jumlah_klik") {
      sorted.sort((a, b) => (b.jumlah_klik || 0) - (a.jumlah_klik || 0));
    }
    return sorted;
  }, [filteredLinks, sortOption]);

  return (
    <main className="w-full max-w-2xl relative z-20">
      <div className="flex gap-2 mb-4">
        <GlassInput
          type="text"
          placeholder="Cari berdasarkan lembaga atau slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <GlassSelect value={sortOption} onValueChange={setSortOption}>
          <GlassSelectTrigger className="w-48">
            <GlassSelectValue placeholder="Urutkan berdasarkan" />
          </GlassSelectTrigger>
          <GlassSelectContent>
            <GlassSelectItem value="waktu">Waktu</GlassSelectItem>
            <GlassSelectItem value="jumlah_klik">Kunjungan</GlassSelectItem>
          </GlassSelectContent>
        </GlassSelect>
      </div>
      <GlassTable className="max-h-130 sm:max-h-120 ">
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
            <GlassTableHead className="w-px whitespace-nowrap text-center">
              Aksi
            </GlassTableHead>
          </GlassTableRow>
        </GlassTableHeader>
        <GlassTableBody>
          {sortedLinks?.map((link) => (
            <GlassTableRow key={link.id}>
              <GlassTableCell className="font-medium whitespace-nowrap">
                {link.lembaga || "Umum"}
              </GlassTableCell>
              <GlassTableCell className="w-1 whitespace-nowrap">
                <CopyButton slug={link.slug} />
              </GlassTableCell>
              <GlassTableCell className="text-right font-bold whitespace-nowrap">
                {link.jumlah_klik || 0}
              </GlassTableCell>
              <GlassTableCell className="text-xs opacity-60 whitespace-nowrap">
                {new Date(link.created_at).toLocaleDateString("id-ID")}
              </GlassTableCell>
              <GlassTableCell className="text-center">
                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenPasswordDialog(link)}
                >
                  Edit
                </GlassButton>
              </GlassTableCell>
            </GlassTableRow>
          ))}
          {sortedLinks?.length === 0 && (
            <GlassTableRow>
              <GlassTableCell
                colSpan={5}
                className="text-center py-10 opacity-50"
              >
                Tidak ada data yang cocok.
              </GlassTableCell>
            </GlassTableRow>
          )}
        </GlassTableBody>
      </GlassTable>

      <GlassDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <GlassDialogContent className="sm:max-w-md">
          <GlassDialogHeader>
            <GlassDialogTitle>Verifikasi Super Admin</GlassDialogTitle>
            <GlassDialogDescription>
              Masukkan password untuk membuka form edit link.
            </GlassDialogDescription>
          </GlassDialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="edit-admin-password">Password</Label>
            <GlassInput
              id="edit-admin-password"
              type="password"
              placeholder="••••••••"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.stopPropagation();
                  void handleVerifyPassword();
                }
              }}
            />
          </div>
          <GlassDialogFooter className="flex flex-row gap-1.5">
            <GlassButton
              type="button"
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              Batal
            </GlassButton>
            <GlassButton
              type="button"
              onClick={handleVerifyPassword}
              disabled={!adminPassword}
            >
              Lanjut
            </GlassButton>
          </GlassDialogFooter>
        </GlassDialogContent>
      </GlassDialog>

      <GlassDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <GlassDialogContent className="sm:max-w-lg">
          <GlassDialogHeader>
            <GlassDialogTitle>Form Edit Link</GlassDialogTitle>
            <GlassDialogDescription>
              Anda hanya dapat mengubah slug, real URL, dan lembaga.
            </GlassDialogDescription>
          </GlassDialogHeader>

          <form
            onSubmit={handleSubmit(handleEditFormSubmit)}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <GlassInput
                id="edit-slug"
                type="text"
                {...register("slug")}
                className={errors.slug ? "border-red-500" : ""}
                placeholder="Masukkan slug"
              />
              {errors.slug && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-url-asli">Real URL</Label>
              <p className="text-xs text-white/60 break-all">
                Real URL sebelumnya: {previousUrlAsli || "(kosong)"}
              </p>
              <GlassInput
                id="edit-url-asli"
                type="text"
                {...register("urlAsli")}
                className={errors.urlAsli ? "border-red-500" : ""}
                placeholder="https://contoh.com"
              />
              {errors.urlAsli && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.urlAsli.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lembaga">Lembaga</Label>
              <GlassSelect
                value={selectedLembaga}
                onValueChange={(value) => {
                  setSelectedLembaga(value);
                  setValue("lembaga", value, { shouldValidate: true });
                }}
              >
                <GlassSelectTrigger id="edit-lembaga" className="w-full">
                  <GlassSelectValue placeholder="Pilih lembaga" />
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

            <GlassDialogFooter className="flex flex-row gap-1.5">
              <GlassButton
                type="button"
                variant="destructive"
                onClick={handleOpenDeleteDialog}
                disabled={isSubmittingEdit || isSubmittingDelete}
              >
                Delete
              </GlassButton>
              <GlassButton
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmittingEdit || isSubmittingDelete}
              >
                Tutup
              </GlassButton>
              <GlassButton
                type="submit"
                disabled={isSubmittingEdit || isSubmittingDelete}
              >
                {isSubmittingEdit ? "Menyimpan..." : "Simpan Perubahan"}
              </GlassButton>
            </GlassDialogFooter>
          </form>
        </GlassDialogContent>
      </GlassDialog>

      <GlassDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <GlassDialogContent className="sm:max-w-md">
          <GlassDialogHeader>
            <GlassDialogTitle>Konfirmasi Hapus Link</GlassDialogTitle>
            <GlassDialogDescription>
              Untuk menghapus data, ketik slug berikut secara persis:
              <span className="ml-1 font-semibold text-red-300 break-all">
                {selectedLink?.slug || "-"}
              </span>
            </GlassDialogDescription>
          </GlassDialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="delete-confirm-slug">Ketik slug konfirmasi</Label>
            <GlassInput
              id="delete-confirm-slug"
              type="text"
              value={deleteConfirmationSlug}
              onChange={(event) =>
                setDeleteConfirmationSlug(event.target.value)
              }
              placeholder="Masukkan slug persis"
            />
          </div>

          <GlassDialogFooter className="flex flex-row gap-1.5">
            <GlassButton
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmittingDelete}
            >
              Batal
            </GlassButton>
            <GlassButton
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={
                isSubmittingDelete ||
                !selectedLink ||
                deleteConfirmationSlug !== selectedLink.slug
              }
            >
              {isSubmittingDelete ? "Menghapus..." : "Hapus Permanen"}
            </GlassButton>
          </GlassDialogFooter>
        </GlassDialogContent>
      </GlassDialog>
    </main>
  );
}
