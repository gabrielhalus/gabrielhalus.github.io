"use client";

import {
  ThemeProvider as NextThemesProvider,
  type Attribute,
} from "next-themes";
import { createContext, useContext } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];
  defaultTheme?: string;
  enableSystem?: boolean;
};

const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
}>({
  theme: "system",
  setTheme: () => null,
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
