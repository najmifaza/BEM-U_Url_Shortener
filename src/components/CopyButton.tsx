"use client";

import { useState } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import { Check } from "lucide-react";

export default function CopyButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullUrl = `BEM-Unsoed.com/${slug}`; // ${window.location.origin}/${slug}
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassButton
      size="sm"
      variant="outline"
      onClick={handleCopy}
      className="min-w-25 transition-all"
    >
      {copied ? <Check className="size-3 text-green-400" /> : null}
      <span className={copied ? "text-green-400" : ""}>
        {copied ? "Copied!" : slug}
      </span>
    </GlassButton>
  );
}
