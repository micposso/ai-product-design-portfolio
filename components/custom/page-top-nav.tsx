import Link from "next/link";

import { SidebarAudioPlayer } from "@/components/custom/sidebar-audio-player";
import { CompactThemeToggle, ThemeToggle } from "@/components/custom/theme-toggle";

const items = [
  { href: "/", label: "Home", key: "home" },
  { href: "/case-study", label: "Products", key: "products" },
  { href: "/insights", label: "Insights", key: "insights" },
  { href: "/education", label: "Education", key: "education" },
] as const;

export function PageTopNav({
  active,
}: {
  active: "home" | "products" | "insights" | "education";
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="w-full lg:hidden">
        <SidebarAudioPlayer />
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 lg:hidden">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {items.map((item) =>
            item.key === active ? (
              <span
                key={item.key}
                className="editorial-sans inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)]"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="editorial-card editorial-sans inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
        <div className="shrink-0 self-start">
          <CompactThemeToggle />
        </div>
      </div>

      <div className="hidden w-full flex-col gap-3 lg:flex lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
          {items.map((item) =>
            item.key === active ? (
              <span
                key={item.key}
                className="editorial-sans inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)]"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="editorial-card editorial-sans inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
        <div className="self-end shrink-0 sm:ml-auto sm:self-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
