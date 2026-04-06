import { notFound } from "next/navigation";

import { AnimatedCard } from "@/components/custom/animated-card";
import { CaseStudyChat } from "@/components/custom/case-study-chat";
import { ExpandableImage } from "@/components/custom/expandable-image";
import { PageTopNav } from "@/components/custom/page-top-nav";
import { SidebarRail } from "@/components/custom/sidebar-rail";
import {
  buildInsightContextDocument,
  getInsightBySlug,
  getInsightSuggestedActions,
} from "@/lib/insights";
import { generateUUID } from "@/lib/utils";

function parseInlineImageParagraph(paragraph: string) {
  const lines = paragraph
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  const imageMatch = lines[0]?.match(/^!\[(.*)\]\((.+)\)$/);

  if (!imageMatch) {
    return null;
  }

  const alt = imageMatch[1]?.trim() || "Insight image";
  const src = imageMatch[2]?.trim();
  const captionLine = lines[1];
  const caption = captionLine?.startsWith("Caption:")
    ? captionLine.replace("Caption:", "").trim()
    : undefined;

  if (!src) {
    return null;
  }

  return { alt, src, caption };
}

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
  const insightDocument = buildInsightContextDocument(post);

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
                        {post.publishedAt}
                      </span>
                      <span className="editorial-sans font-semibold">
                        {post.category}
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

                {post.image ? (
                  <AnimatedCard delay={0.18}>
                    <div className="overflow-hidden rounded-2xl border border-[color:var(--editorial-border)] shadow-[var(--editorial-shadow)]">
                      <div
                        className="relative aspect-[21/8] w-full rounded-2xl bg-cover bg-center bg-fixed"
                        style={{ backgroundImage: `url(${post.image})` }}
                        aria-label={post.title}
                        role="img"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#1f1914]/30 via-[#1f1914]/8 to-transparent" />
                        {post.imageNote ? (
                          <div className="absolute bottom-4 right-4 z-10 max-w-[22rem] rounded-xl border border-white/20 bg-[#1f1914]/72 px-3 py-2 text-right shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:bottom-5 sm:right-5 sm:max-w-[24rem] sm:px-4">
                            <p className="text-sm leading-6 text-white sm:text-[0.95rem]">
                              {post.imageNote}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </AnimatedCard>
                ) : null}

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
                              .map((paragraph, paragraphIndex) => {
                                const isList = paragraph.startsWith("- ");
                                const isQuote =
                                  paragraph.startsWith('"') &&
                                  paragraph.endsWith('"');
                                const inlineImage = parseInlineImageParagraph(
                                  paragraph,
                                );

                                return isList ? (
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
                                ) : inlineImage ? (
                                  <div
                                    key={`${section.title}-${paragraphIndex}`}
                                    className="overflow-hidden rounded-2xl border border-[color:var(--editorial-border)] shadow-[var(--editorial-shadow)]"
                                  >
                                    <div className="relative aspect-[21/8] w-full rounded-2xl">
                                      <ExpandableImage
                                        src={inlineImage.src}
                                        alt={inlineImage.alt}
                                        className="size-full rounded-2xl object-cover"
                                      />
                                    </div>
                                    {inlineImage.caption ? (
                                      <div className="border-t border-[color:var(--editorial-border)] bg-[var(--editorial-subtle-surface)] px-4 py-3 sm:px-5">
                                        <p className="editorial-muted text-sm leading-6">
                                          {inlineImage.caption}
                                        </p>
                                      </div>
                                    ) : null}
                                  </div>
                                ) : isQuote ? (
                                  <blockquote
                                    key={`${section.title}-${paragraphIndex}`}
                                    className="case-study-pullquote my-8 border-y border-[color:var(--editorial-border)] py-6 text-center text-xl italic leading-9 text-[var(--color-brand-primary)] sm:px-8 sm:text-2xl"
                                  >
                                    <p className="font-display">{paragraph}</p>
                                  </blockquote>
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
                                );
                              })}
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
        pageContext={{
          type: "insight",
          slug: post.slug,
          title: post.title,
          documentText: insightDocument,
        }}
        suggestedActions={getInsightSuggestedActions(post)}
      />
    </div>
  );
}
