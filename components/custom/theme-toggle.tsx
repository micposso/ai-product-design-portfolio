"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className="group h-9 w-[72px] rounded-full border-zinc-200 bg-white/80 px-1 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80"
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
    >
      <span className="relative flex h-7 w-full items-center">
        <span className="flex w-full items-center justify-between px-1 text-zinc-500 dark:text-zinc-400">
          <Sun className="size-4" />
          <Moon className="size-4" />
        </span>
        <span
          className={`absolute top-0 flex size-7 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform dark:bg-zinc-100 dark:text-zinc-900 ${
            isDark ? "translate-x-9" : "translate-x-0"
          }`}
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </span>
      </span>
    </Button>
  );
}
