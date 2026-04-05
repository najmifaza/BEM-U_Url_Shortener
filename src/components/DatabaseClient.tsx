"use client";

import { useState, useMemo } from "react";
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
import {
  GlassSelect,
  GlassSelectContent,
  GlassSelectItem,
  GlassSelectTrigger,
  GlassSelectValue,
} from "@/components/glass-select";

interface Link {
  id: string;
  lembaga: string | null;
  slug: string;
  jumlah_klik: number | null;
  created_at: string;
}

interface DatabaseClientProps {
  initialLinks: Link[];
}

export default function DatabaseClient({ initialLinks }: DatabaseClientProps) {
  const [links] = useState(initialLinks);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("waktu");

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
    let sorted = [...filteredLinks];
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
          </GlassTableRow>
        </GlassTableHeader>
        <GlassTableBody>
          {sortedLinks?.map((link) => (
            <GlassTableRow key={link.id}>
              <GlassTableCell className="font-medium whitespace-nowrap">
                {link.lembaga || "Umum"}
              </GlassTableCell>
              <GlassTableCell className="min-w-37.5">
                <CopyButton slug={link.slug} />
              </GlassTableCell>
              <GlassTableCell className="text-right font-bold whitespace-nowrap">
                {link.jumlah_klik || 0}
              </GlassTableCell>
              <GlassTableCell className="text-xs opacity-60 whitespace-nowrap">
                {new Date(link.created_at).toLocaleDateString("id-ID")}
              </GlassTableCell>
            </GlassTableRow>
          ))}
          {sortedLinks?.length === 0 && (
            <GlassTableRow>
              <GlassTableCell
                colSpan={4}
                className="text-center py-10 opacity-50"
              >
                Tidak ada data yang cocok.
              </GlassTableCell>
            </GlassTableRow>
          )}
        </GlassTableBody>
      </GlassTable>
    </main>
  );
}
