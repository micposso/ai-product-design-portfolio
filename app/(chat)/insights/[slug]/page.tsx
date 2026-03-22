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
    <div className="px-4 pb-36 md:px-6 md:pb-40">
      <article className="mx-auto flex w-full max-w-screen-xl flex-col p-4 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
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
                    Category
                  </p>
                  <p className="mt-1 leading-6 text-white">{post.category}</p>
                </div>
                <div className="border-l border-white/25 pl-4 text-sm text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                    Read time
                  </p>
                  <p className="mt-1 leading-6 text-white">{post.readTime}</p>
                </div>
              </div>
            </div>

            <div className="hidden rounded-xl border border-white/55 bg-white/55 px-5 py-3 text-center text-sm text-[#4b3d31] shadow-[0_16px_40px_-28px_rgba(20,16,12,0.3)] md:block">
              Read the note, then open the chat to dig into the decisions behind it.
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link
                  href="/insights"
                  className="inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-sm text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] transition hover:opacity-95"
                >
                  Back to insights
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#f7f1ea] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]">
              <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-8">
                <header className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#8b725f]">
                    <span>{post.category}</span>
                    <span>{post.publishedAt}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h1 className="mt-4 text-4xl font-medium tracking-tight text-[#261d18] md:text-6xl">
                    {post.title}
                  </h1>
                  <p className="mt-4 text-base leading-8 text-[#665548] md:text-lg">
                    {post.excerpt}
                  </p>
                </header>

                <section className="rounded-xl border border-white/65 bg-white/72 p-6 shadow-[0_18px_48px_-36px_rgba(34,25,19,0.18)] sm:p-8">
                  <div className="space-y-6 text-base leading-8 text-[#665548]">
                    {post.sections
                      .filter((section) => section.title !== "Excerpt")
                      .map((section) => (
                        <div key={section.title} className="space-y-4">
                          <h2 className="text-2xl font-medium text-[#261d18]">
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
                                    .map((line) =>
                                      line.replace(/^\-\s*/, "").trim(),
                                    )
                                    .filter(Boolean)
                                    .map((line) => (
                                      <li key={line}>{line}</li>
                                    ))}
                                </ul>
                              ) : (
                                <p key={`${section.title}-${index}`}>
                                  {paragraph}
                                </p>
                              ),
                            )}
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            </div>
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
