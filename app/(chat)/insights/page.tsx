import Link from "next/link";

import { SidebarBrandCard } from "@/components/custom/sidebar-brand-card";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { insightPosts } from "@/lib/insights";

export default function Page() {
  return (
    <div className="px-4 pb-6 md:px-6 md:pb-8">
      <main className="mx-auto flex w-full max-w-screen-xl flex-col p-4 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex flex-col justify-center gap-4">
            <SidebarBrandCard />
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <Link
                  href="/"
                  className="editorial-card editorial-sans inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
                >
                  Home
                </Link>
                <Link
                  href="/case-study"
                  className="editorial-card editorial-sans inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
                >
                  Products
                </Link>
                <span className="editorial-sans inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)]">
                  Insights
                </span>
                <Link
                  href="/education"
                  className="editorial-card editorial-sans inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
                >
                  Education
                </Link>
              </div>
              <div className="self-end sm:ml-auto sm:self-auto shrink-0">
                <ThemeToggle />
              </div>
            </div>

            <div className="content-fade-in overflow-hidden rounded-2xl bg-[var(--editorial-shell)] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]">
              <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-8">
                <section className="max-w-3xl border-l border-[color:var(--editorial-border)] pl-4">
                  <p className="editorial-sans editorial-subtle text-xs font-semibold uppercase tracking-[0.18em]">
                    Insights
                  </p>
                  <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-[var(--editorial-text)] sm:text-4xl md:text-6xl">
                    Notes on product, AI, and design engineering.
                  </h1>
                  <p className="editorial-muted mt-4 max-w-2xl text-base leading-8 md:text-lg">
                    Working notes, launch thinking, and product decisions behind
                    the shipped work.
                  </p>
                </section>

                <section className="grid gap-4">
                  {insightPosts.map((post) => (
                    <div key={post.slug}>
                      <Link
                        href={`/insights/${post.slug}`}
                        className="editorial-card block rounded-xl border p-5 transition hover:-translate-y-0.5 hover:brightness-110"
                      >
                        <div className="editorial-subtle mb-3 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em]">
                          <span className="editorial-sans font-semibold">
                            {post.publishedAt}
                          </span>
                          <span className="editorial-sans font-semibold">
                            {post.category}
                          </span>
                        </div>
                        <h2 className="break-words text-2xl font-bold text-[var(--editorial-text)]">
                          {post.title}
                        </h2>
                        <p className="editorial-muted mt-3 max-w-3xl text-base leading-8">
                          {post.excerpt}
                        </p>
                      </Link>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
