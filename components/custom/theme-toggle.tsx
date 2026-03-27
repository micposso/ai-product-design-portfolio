"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";

export function ThemeToggle() {
  return <ThemeToggleInner compact={false} />;
}

export function CompactThemeToggle() {
  return <ThemeToggleInner compact={true} />;
}

function ThemeToggleInner({ compact }: { compact: boolean }) {
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
      className={
        compact
          ? "group size-10 shrink-0 rounded-full border-[color:var(--editorial-border)] bg-[var(--editorial-card)] px-0 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)]"
          : "group h-9 w-[72px] rounded-full border-[color:var(--editorial-border)] bg-[var(--editorial-card)] px-1 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)]"
      }
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
    >
      <span
        className={
          compact
            ? "relative flex size-8 items-center justify-center"
            : "relative flex h-7 w-full items-center"
        }
      >
        <span
          className={
            compact
              ? "absolute inset-0 flex items-center justify-center text-[var(--editorial-placeholder)]"
              : "flex w-full items-center justify-between px-1 text-[var(--editorial-placeholder)]"
          }
        >
          <Sun className="size-4" />
          {compact ? null : <Moon className="size-4" />}
        </span>
        <span
          className={
            compact
              ? "absolute inset-0 flex items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white transition-transform"
              : `absolute top-0 flex size-7 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white transition-transform ${
                  isDark ? "translate-x-9" : "translate-x-0"
                }`
          }
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </span>
      </span>
    </Button>
  );
}
