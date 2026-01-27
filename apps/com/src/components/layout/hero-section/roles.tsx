"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function Roles() {
  const t = useTranslations("roles");
  const roles = [t("fullstack"), t("architect"), t("oss")];

  const [currentRole, setCurrentRole] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentRole(prev => (prev + 1) % roles.length);
        setIsAnimating(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      {roles[currentRole]}
    </span>
  );
}
