import {
  GlassAvatar,
  GlassAvatarFallback,
  GlassAvatarImage,
} from "@/components/ui/glass-avatar";
import { GlassBadge } from "@/components/ui/glass-badge";
import {
  GlassCard,
  GlassCardContent,
  GlassCardDescription,
  GlassCardHeader,
  GlassCardTitle,
} from "@/components/ui/glass-card";
import { PhoneCall } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
export default function Database() {
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
      <main className="w-full max-w-sm  ">
        <GlassCard className="">
          <GlassCardHeader className="items-center">
            <GlassAvatar className="h-16 w-16">
              <GlassAvatarImage src="/Admin.jpg" alt="User" />
              <GlassAvatarFallback>Najmi</GlassAvatarFallback>
            </GlassAvatar>
            <GlassCardTitle className="mt-4">Najmi Faza</GlassCardTitle>
            <GlassCardDescription className="text-center">
              <span className="font-bold"> Kementrian Media Komunikasi </span>
              <br />
              Direktorat Jenderal Website
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent className="text-center ">
            {" "}
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
                <PhoneCall className="h-5! w-5!" /> Report Bug
              </a>
            </GlassButton>
          </GlassCardContent>
        </GlassCard>
      </main>
    </div>
  );
}
