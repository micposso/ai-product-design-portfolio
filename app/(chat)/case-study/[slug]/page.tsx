import { CircleAlert, Sparkles } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AnimatedCard } from "@/components/custom/animated-card";
import { ArticleEmailButton } from "@/components/custom/article-email-button";
import { CaseStudyChat } from "@/components/custom/case-study-chat";
import { PageTopNav } from "@/components/custom/page-top-nav";
import { SidebarRail } from "@/components/custom/sidebar-rail";
import {
  buildCaseStudyContextDocument,
  caseStudies,
  getCaseStudyBySlug,
} from "@/lib/case-studies";

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const chatId = `case-study-${caseStudy.slug}`;
  const caseStudyDocument = buildCaseStudyContextDocument(caseStudy);
  const articleUrl = `https://www.michaelposso.ai/case-study/${caseStudy.slug}`;

  return (
    <div className="px-4 pb-36 md:px-6 md:pb-40">
      <article className="mx-auto flex w-full max-w-screen-xl flex-col p-4 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <SidebarRail />

          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <PageTopNav active="products" />

            <AnimatedCard
              delay={0.08}
              className="overflow-hidden rounded-2xl bg-[var(--editorial-shell)] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]"
            >
              <div className="flex flex-col gap-6 p-3 sm:p-4 lg:p-5">
                <AnimatedCard delay={0.14}>
                  <section className="editorial-card rounded-xl border p-4 sm:p-5">
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-center">
                      <div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <ArticleEmailButton
                              articleTitle={caseStudy.title}
                              articleUrl={articleUrl}
                              buttonLabel="Email Me This Case Study"
                            />
                            <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                              {caseStudy.eyebrow}
                            </p>
                          </div>
                        </div>
                        <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-[var(--editorial-text)] sm:text-4xl md:text-6xl">
                          {caseStudy.title}
                        </h1>
                        <p className="mt-4 text-[0.95rem] leading-7 text-[var(--editorial-text)]">
                          {caseStudy.summary}
                        </p>
                        {caseStudy.tags.length > 0 ? (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {caseStudy.tags.map((tag) => (
                              <span
                                key={tag}
                                className="editorial-sans inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="relative overflow-hidden rounded-2xl border border-[color:var(--editorial-border)] shadow-[var(--editorial-shadow)]">
                        <div className="relative aspect-[4/5] w-full">
                          <Image
                            src={caseStudy.image}
                            alt={caseStudy.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1f1914]/52 via-[#1f1914]/12 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </section>
                </AnimatedCard>

                <section className="grid gap-4 md:grid-cols-2">
                  <AnimatedCard delay={0.18} className="h-full">
                    <div className="case-study-card-copy editorial-card flex h-full flex-col rounded-xl border p-5 sm:p-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--editorial-border)]">
                          <CircleAlert className="size-4" />
                        </span>
                      </div>
                      <h2 className="mt-4 break-words text-2xl font-bold text-[var(--editorial-text)]">
                        Challenge
                      </h2>
                      <p className="mt-3 text-[0.92rem] leading-7 text-[var(--editorial-text)]">
                        {caseStudy.challenge}
                      </p>
                    </div>
                  </AnimatedCard>

                  <AnimatedCard delay={0.22} className="h-full">
                    <div className="case-study-card-copy editorial-card flex h-full flex-col rounded-xl border p-5 sm:p-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--editorial-border)]">
                          <Sparkles className="size-4" />
                        </span>
                      </div>
                      <h2 className="mt-4 break-words text-2xl font-bold text-[var(--editorial-text)]">
                        Outcome
                      </h2>
                      <p className="mt-3 text-[0.92rem] leading-7 text-[var(--editorial-text)]">
                        {caseStudy.outcome}
                      </p>
                    </div>
                  </AnimatedCard>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                  {caseStudy.stages.map((stage, index) => (
                    <AnimatedCard
                      key={stage.title}
                      delay={0.26 + index * 0.05}
                      className="h-full"
                    >
                      <div className="case-study-card-copy editorial-card flex h-full flex-col rounded-xl border p-5 sm:p-6">
                        <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                          {stage.label}
                        </p>
                        <h2 className="mt-3 break-words text-2xl font-bold text-[var(--editorial-text)]">
                          {stage.title}
                        </h2>
                        <p className="mt-3 text-[0.92rem] leading-7 text-[var(--editorial-text)]">
                          {stage.description}
                        </p>
                      </div>
                    </AnimatedCard>
                  ))}
                </section>

                <AnimatedCard delay={0.42}>
                  <section className="case-study-card-copy editorial-card rounded-xl border p-6 sm:p-8">
                    <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                      Notes
                    </p>
                    <div className="mt-5 space-y-5 text-[0.95rem] leading-7 text-[var(--editorial-text)]">
                      {caseStudy.notes.map((note, index) => {
                        const isQuote =
                          note.startsWith('"') && note.endsWith('"');

                        if (isQuote) {
                          return (
                            <blockquote
                              key={note}
                              className="case-study-pullquote my-8 border-y border-[color:var(--editorial-border)] py-6 text-center text-xl italic leading-9 text-[var(--editorial-text)] sm:px-8 sm:text-2xl"
                            >
                              <p className="font-display">{note}</p>
                            </blockquote>
                          );
                        }

                        return (
                          <p
                            key={note}
                            className={
                              index === 0
                                ? "text-[1.08rem] leading-7 sm:text-[1.18rem] sm:leading-8"
                                : undefined
                            }
                          >
                            {note}
                          </p>
                        );
                      })}
                    </div>
                  </section>
                </AnimatedCard>

                {caseStudy.qa.length > 0 ? (
                  <AnimatedCard delay={0.46}>
                    <section className="case-study-card-copy editorial-card rounded-xl border p-6 sm:p-8">
                      <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                        Q&A
                      </p>
                      <div className="mt-5 space-y-5 text-[0.95rem] leading-7 text-[var(--editorial-text)]">
                        {caseStudy.qa.map((entry) => (
                          <div key={entry.question}>
                            <h2 className="text-lg font-semibold text-[var(--editorial-text)]">
                              {entry.question}
                            </h2>
                            <p className="mt-2">{entry.answer}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </AnimatedCard>
                ) : null}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </article>

      <CaseStudyChat
        id={chatId}
        promptHint={caseStudy.prompt}
        pageContext={{
          type: "case-study",
          slug: caseStudy.slug,
          title: caseStudy.title,
          documentText: caseStudyDocument,
        }}
        suggestedActions={[
          {
            title: "What was the",
            label: "core product problem here?",
            action: "What was the core product problem in this case study?",
          },
          {
            title: "Walk me through",
            label: "the decisions that shaped the solution",
            action: "Walk me through the key product and engineering decisions that shaped the solution in this case study.",
          },
          {
            title: "What tradeoffs",
            label: "did you have to make?",
            action: "What tradeoffs did you have to make in this project, and how did you decide between them?",
          },
          {
            title: "How did this",
            label: "move from concept to shipped work?",
            action: "How did this project move from concept to shipped work?",
          },
        ]}
      />
    </div>
  );
}
