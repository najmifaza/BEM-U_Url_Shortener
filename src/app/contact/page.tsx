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
      <main className="w-full max-w-md relative z-20 ">
        <GlassCard className="w-full max-w-sm">
          <GlassCardHeader className="items-center">
            <GlassAvatar className="h-16 w-16">
              <GlassAvatarImage src="/avatar.png" alt="User" />
              <GlassAvatarFallback>JD</GlassAvatarFallback>
            </GlassAvatar>
            <GlassCardTitle className="mt-4">John Doe</GlassCardTitle>
            <GlassCardDescription>Software Engineer</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent className="text-center">
            <div className="flex justify-center gap-4">
              <GlassBadge>React</GlassBadge>
              <GlassBadge variant="primary">TypeScript</GlassBadge>
            </div>
          </GlassCardContent>
        </GlassCard>
      </main>
    </div>
  );
}
