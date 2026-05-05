"use client";

import { GlassDock } from "@/components/ui/glass-dock";
import { Home, Database, ContactRound, Link, QrCode } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Dock() {
  const pathname = usePathname();
  const items = [
    {
      id: "home",
      icon: <Home />,
      label: "Home",
      href: "/",
      active: pathname === "/",
    },
    {
      id: "shortener",
      icon: <Link />,
      label: "Shortner",
      href: "/shortener",
      active: pathname === "/shortener",
    },
    {
      id: "qrgenerator",
      icon: <QrCode />,
      label: "QrGenerator",
      href: "/qrgenerator",
      active: pathname === "/qrgenerator",
    },
    {
      id: "database",
      icon: <Database />,
      label: "Database",
      href: "/database",
      active: pathname === "/database",
    },
    {
      id: "contact",
      icon: <ContactRound />,
      label: "Contact Admin",
      href: "/contact",
      active: pathname === "/contact",
    },
  ];
  const validPaths = items.map((item) => item.href);
  // Jika pathname saat ini tidak ada di daftar validPaths, sembunyikan Dock
  // Ini otomatis akan menyembunyikan Dock di halaman /[slug] dan halaman 404
  if (!validPaths.includes(pathname)) {
    return null;
  }
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <GlassDock items={items} />
    </div>
  );
}
