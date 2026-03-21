import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyChat } from "@/components/custom/case-study-chat";
import { getInsightBySlug } from "@/lib/insights";
import { generateUUID } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getInsightBySlug(slug);

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
            {post.sections
              .filter((section) => section.title !== "Excerpt")
              .map((section) => (
                <div key={section.title} className="space-y-4">
                  <h2 className="text-2xl font-medium text-zinc-950 dark:text-zinc-100">
                    {section.title}
                  </h2>
                  {section.content
                    .split(/\n\n+/)
                    .map((paragraph) => paragraph.trim())
                    .filter(Boolean)
                    .map((paragraph, index) =>
                      paragraph.startsWith("- ") ? (
                        <ul
                          key={`${section.title}-${index}`}
                          className="list-disc space-y-2 pl-6"
                        >
                          {paragraph
                            .split("\n")
                            .map((line) => line.replace(/^\-\s*/, "").trim())
                            .filter(Boolean)
                            .map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                        </ul>
                      ) : (
                        <p key={`${section.title}-${index}`}>{paragraph}</p>
                      ),
                    )}
                </div>
              ))}
          </div>
        </section>
      </article>

      <CaseStudyChat
        id={chatId}
        promptHint={post.prompt}
        dockLabel="Chat About This Post"
        overlayTitle="Ask about this post"
        pageContext={{ type: "insight", slug: post.slug }}
        suggestedActions={[
          {
            title: "What is this",
            label: "post about?",
            action: "What is this post about?",
          },
          {
            title: "Where can I",
            label: "see this project",
            action: "Where can I see this project",
          },
        ]}
      />
    </div>
  );
}
