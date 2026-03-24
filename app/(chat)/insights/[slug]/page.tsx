import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimatedCard } from "@/components/custom/animated-card";
import { CaseStudyChat } from "@/components/custom/case-study-chat";
import { SidebarBrandCard } from "@/components/custom/sidebar-brand-card";
import { ThemeToggle } from "@/components/custom/theme-toggle";
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
    <div className="px-4 pb-36 md:px-6 md:pb-40">
      <article className="mx-auto flex w-full max-w-screen-xl flex-col p-4 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex flex-col justify-center gap-4">
            <SidebarBrandCard />
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex w-full flex-wrap items-start justify-between gap-3 sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
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
                <div className="ml-auto shrink-0">
                  <ThemeToggle />
                </div>
              </div>
            </div>

            <AnimatedCard
              delay={0.08}
              className="rounded-2xl bg-[var(--editorial-shell)] px-4 py-5 shadow-[0_30px_90px_-46px_rgba(28,23,19,0.24)] sm:px-6 sm:py-6 lg:px-8 lg:py-8"
            >
              <div className="flex flex-col gap-8">
                <AnimatedCard delay={0.14}>
                  <header className="max-w-3xl border-l border-[color:var(--editorial-border)] pl-4">
                    <div className="editorial-subtle flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em]">
                      <span className="editorial-sans font-semibold">
                        Date: {post.publishedAt}
                      </span>
                      <span className="editorial-sans font-semibold">
                        Category: {post.category}
                      </span>
                      <span className="editorial-sans font-semibold">
                        {post.readTime}
                      </span>
                    </div>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--editorial-text)] md:text-6xl">
                      {post.title}
                    </h1>
                    <p className="editorial-muted mt-4 max-w-3xl text-base leading-8 md:text-lg">
                      {post.excerpt}
                    </p>
                  </header>
                </AnimatedCard>

                <section className="max-w-4xl">
                  <div className="editorial-muted space-y-8 text-[1.02rem] leading-8">
                    {post.sections
                      .filter((section) => section.title !== "Excerpt")
                      .map((section, index) => (
                        <AnimatedCard
                          key={section.title}
                          delay={0.2 + index * 0.05}
                        >
                          <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[var(--editorial-text)]">
                              {section.title}
                            </h2>
                            {section.content
                              .split(/\n\n+/)
                              .map((paragraph) => paragraph.trim())
                              .filter(Boolean)
                              .map((paragraph, paragraphIndex) =>
                                paragraph.startsWith("- ") ? (
                                  <ul
                                    key={`${section.title}-${paragraphIndex}`}
                                    className="list-disc space-y-2 pl-6"
                                  >
                                    {paragraph
                                      .split("\n")
                                      .map((line) =>
                                        line.replace(/^\-\s*/, "").trim(),
                                      )
                                      .filter(Boolean)
                                      .map((line) => (
                                        <li key={line}>{line}</li>
                                      ))}
                                  </ul>
                                ) : (
                                  <p key={`${section.title}-${paragraphIndex}`}>
                                    {paragraph}
                                  </p>
                                ),
                              )}
                          </div>
                        </AnimatedCard>
                      ))}
                  </div>
                </section>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </article>

      <CaseStudyChat
        id={chatId}
        promptHint={post.prompt}
        dockLabel="Chat About This Post"
        overlayTitle="Ask about this post"
        pageContext={{ type: "insight", slug: post.slug }}
        suggestedActions={[
          {
            title: "Summarize the",
            label: "core argument of this piece",
            action: "Summarize the core argument of this piece.",
          },
          {
            title: "What product",
            label: "decisions are behind this post?",
            action: "What product decisions are behind this post?",
          },
          {
            title: "How would you",
            label: "apply these ideas in practice?",
            action: "How would you apply the ideas in this post to a real product team?",
          },
          {
            title: "What should I",
            label: "take away from this as a builder?",
            action: "What should I take away from this post as a product builder?",
          },
        ]}
      />
    </div>
  );
}
