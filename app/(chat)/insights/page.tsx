import Link from "next/link";

import { insightPosts } from "@/lib/insights";

export default function Page() {
  return (
    <div className="px-4 pb-6 md:px-6 md:pb-8">
      <main className="mx-auto flex w-full max-w-screen-xl flex-col p-4 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-xl bg-[#1A3A22]/84 p-5 shadow-[0_24px_60px_-36px_rgba(20,16,12,0.35)] backdrop-blur">
              <Link href="/" className="inline-flex flex-col items-start">
                <span className="text-[clamp(2rem,3vw,3.25rem)] leading-[0.9] -tracking-wider text-white">
                  Michael
                </span>
                <span className="text-[clamp(2rem,3vw,3.25rem)] leading-[0.9] -tracking-wider text-white">
                  Posso.ai
                </span>
              </Link>

              <div className="mt-5 space-y-4">
                <div className="border-l border-white/25 pl-4 text-sm text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                    Section
                  </p>
                  <p className="mt-1 leading-6 text-white">
                    Notes on product, AI, and design engineering.
                  </p>
                </div>
                <div className="border-l border-white/25 pl-4 text-sm text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                    Best for
                  </p>
                  <p className="mt-1 leading-6 text-white">
                    Founders and teams looking for product thinking in context.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden rounded-xl border border-white/55 bg-white/55 px-5 py-3 text-center text-sm text-[#4b3d31] shadow-[0_16px_40px_-28px_rgba(20,16,12,0.3)] md:block">
              Browse the writing with the same editorial surface as the chat.
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-sm text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] transition hover:opacity-95"
                >
                  Home
                </Link>
                <span className="inline-flex rounded-full border border-white/65 bg-white/70 px-4 py-2 text-sm text-[#4b3d31] backdrop-blur-sm">
                  Insights
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#f7f1ea] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]">
              <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-8">
                <section className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8b725f]">
                    Insights
                  </p>
                  <h1 className="mt-3 text-4xl font-medium tracking-tight text-[#261d18] md:text-6xl">
                    Notes on product, AI, and design engineering.
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-[#665548] md:text-lg">
                    Working notes, launch thinking, and product decisions behind
                    the shipped work.
                  </p>
                </section>

                <section className="grid gap-4">
                  {insightPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/insights/${post.slug}`}
                      className="rounded-xl border border-white/65 bg-white/72 p-5 shadow-[0_18px_48px_-36px_rgba(34,25,19,0.18)] transition hover:-translate-y-0.5 hover:bg-white/82"
                    >
                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#8b725f]">
                        <span>{post.category}</span>
                        <span>{post.publishedAt}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="mt-4 text-2xl font-medium text-[#261d18]">
                        {post.title}
                      </h2>
                      <p className="mt-3 max-w-3xl text-base leading-8 text-[#665548]">
                        {post.excerpt}
                      </p>
                    </Link>
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
