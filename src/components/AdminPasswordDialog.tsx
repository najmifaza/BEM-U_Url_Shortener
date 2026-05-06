"use client";

import { Label } from "@/components/ui/label";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import {
  GlassDialog,
  GlassDialogContent,
  GlassDialogDescription,
  GlassDialogFooter,
  GlassDialogHeader,
  GlassDialogTitle,
} from "@/components/ui/glass-dialog";

interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  loadingLabel: string;
  loading?: boolean;
  inputId?: string;
}

export function AdminPasswordDialog({
  open,
  onOpenChange,
  password,
  onPasswordChange,
  onConfirm,
  title,
  description,
  confirmLabel,
  loadingLabel,
  loading = false,
  inputId = "admin-password",
}: AdminPasswordDialogProps) {
  return (
    <GlassDialog open={open} onOpenChange={onOpenChange}>
      <GlassDialogContent className="sm:max-w-md">
        <GlassDialogHeader>
          <GlassDialogTitle>{title}</GlassDialogTitle>
          <GlassDialogDescription>{description}</GlassDialogDescription>
        </GlassDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={inputId}>Password</Label>
            <GlassInput
              id={inputId}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onConfirm();
                }
              }}
            />
          </div>
        </div>
        <GlassDialogFooter className="flex flex-row gap-1.5">
          <GlassButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </GlassButton>
          <GlassButton
            type="button"
            onClick={onConfirm}
            disabled={loading || !password}
          >
            {loading ? loadingLabel : confirmLabel}
          </GlassButton>
        </GlassDialogFooter>
      </GlassDialogContent>
    </GlassDialog>
  );
}
