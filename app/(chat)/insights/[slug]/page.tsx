import { notFound } from "next/navigation";

import { AnimatedCard } from "@/components/custom/animated-card";
import { CaseStudyChat } from "@/components/custom/case-study-chat";
import { PageTopNav } from "@/components/custom/page-top-nav";
import { SidebarRail } from "@/components/custom/sidebar-rail";
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
          <SidebarRail />

          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <PageTopNav active="insights" />

            <AnimatedCard
              delay={0.08}
              className="rounded-2xl bg-[var(--editorial-shell)] px-4 py-5 shadow-[0_30px_90px_-46px_rgba(28,23,19,0.24)] sm:p-6 lg:p-8"
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
                    <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-[var(--editorial-text)] sm:text-4xl md:text-6xl">
                      {post.title}
                    </h1>
                    <p className="editorial-muted mt-4 max-w-3xl text-base leading-8 md:text-lg">
                      {post.excerpt}
                    </p>
                  </header>
                </AnimatedCard>

                <section className="max-w-4xl">
                  <div className="insight-copy editorial-muted space-y-8 text-[1.02rem] leading-8">
                    {post.sections
                      .filter((section) => section.title !== "Excerpt")
                      .map((section, index) => (
                        <AnimatedCard
                          key={section.title}
                          delay={0.2 + index * 0.05}
                        >
                          <div className="space-y-4">
                            {section.title !== "Content" ? (
                              <h2 className="break-words text-2xl font-bold text-[var(--editorial-text)]">
                                {section.title}
                              </h2>
                            ) : null}
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
                                  <p
                                    key={`${section.title}-${paragraphIndex}`}
                                    className={
                                      section.title === "Content" &&
                                      paragraphIndex === 0
                                        ? "text-[1.08rem] leading-7 text-[var(--editorial-text)] sm:text-[1.18rem] sm:leading-8"
                                        : undefined
                                    }
                                  >
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
