"use client";

import { useEffect, useState } from "react";

export function Roles() {
  const roles = ["Fullstack Developer", "System Architech", "OSS Enthusiast"];

  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole(prev => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  return roles[currentRole];
}
