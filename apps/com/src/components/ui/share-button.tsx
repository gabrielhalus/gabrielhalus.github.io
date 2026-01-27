"use client";

import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

type ShareButtonProps = {
  title: string;
  text: string;
};

export function ShareButton({ title, text }: ShareButtonProps) {
  const t = useTranslations("blog");

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title,
        text,
        url: window.location.href,
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="ml-auto flex items-center gap-2 text-sm text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
    >
      <Share2 className="w-4 h-4" />
      {t("share")}
    </button>
  );
}
