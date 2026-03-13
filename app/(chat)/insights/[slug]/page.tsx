import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyChat } from "@/components/custom/case-study-chat";
import { getInsightBySlug } from "@/lib/insights";
import { generateUUID } from "@/lib/utils";

export default function Page({ params }: { params: { slug: string } }) {
  const post = getInsightBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const chatId = generateUUID();

  return (
    <div className="min-h-dvh bg-background">
      <article className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-36 pt-24 md:px-6 md:pb-40 md:pt-28">
        <Link
          href="/insights"
          className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Back to insights
        </Link>

        <header className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            <span>{post.category}</span>
            <span>{post.publishedAt}</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 md:text-6xl">
            {post.title}
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            {post.excerpt}
          </p>
        </header>

        <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="space-y-6 text-base leading-8 text-zinc-600 dark:text-zinc-300">
            <p>
              Placeholder blog content goes here. This page is set up like a
              long-form post so you can write about product strategy, AI
              implementation details, design decisions, or lessons learned from
              recent work.
            </p>
            <p>
              The idea is to give readers enough context to understand how you
              think, not just what you shipped. Over time, this can become a
              library of essays, launch notes, teardown posts, or technical
              reflections.
            </p>
            <p>
              This page uses the same floating chat pattern as the case study
              pages, so readers can explore the writing first and then start a
              focused conversation without losing their place.
            </p>
            <p>
              Add more sections, images, quotes, diagrams, or code blocks here
              as needed. For now, this is placeholder copy to make the route and
              interaction model real.
            </p>
          </div>
        </section>
      </article>

      <CaseStudyChat
        id={chatId}
        promptHint={post.prompt}
        dockLabel="Chat About This Post"
        overlayTitle="Ask about this insight"
      />
    </div>
  );
}
