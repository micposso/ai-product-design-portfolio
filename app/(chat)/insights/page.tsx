import Link from "next/link";

import { insightPosts } from "@/lib/insights";

export default function Page() {
  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-24 md:px-6 md:pt-28">
        <section className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
            Insights
          </p>
          <h1 className="text-4xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 md:text-6xl">
            Notes on product, AI, and design engineering.
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            A placeholder space for blog posts, working notes, and deeper
            thinking around the work behind the case studies.
          </p>
        </section>

        <section className="grid gap-5">
          {insightPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/insights/${post.slug}`}
              className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_20px_60px_-34px_rgba(15,23,42,0.35)] dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                <span>{post.category}</span>
                <span>{post.publishedAt}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-4 text-2xl font-medium text-zinc-950 dark:text-zinc-100">
                {post.title}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
