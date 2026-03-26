import Link from "next/link";

import { ThemeToggle } from "@/components/custom/theme-toggle";

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
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
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
  );
}
