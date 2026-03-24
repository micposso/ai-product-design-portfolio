import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleAlert, Sparkles } from "lucide-react";

import { AnimatedCard } from "@/components/custom/animated-card";
import { CaseStudyChat } from "@/components/custom/case-study-chat";
import { SidebarBrandCard } from "@/components/custom/sidebar-brand-card";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { generateUUID } from "@/lib/utils";

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
                    className="editorial-sans inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] transition hover:opacity-95"
                  >
                    Home
                  </Link>
                  <Link
                    href="/case-study"
                    className="editorial-sans inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] transition hover:opacity-95"
                  >
                    Products
                  </Link>
                  <Link
                    href="/insights"
                    className="editorial-sans inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] transition hover:opacity-95"
                  >
                    Insights
                  </Link>
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
              className="overflow-hidden rounded-2xl bg-[var(--editorial-shell)] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]"
            >
              <div className="flex flex-col gap-6 p-3 sm:p-4 lg:p-5">
                <AnimatedCard delay={0.14}>
                  <section className="editorial-card rounded-xl border p-4 sm:p-5">
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-center">
                      <div>
                        <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                          {caseStudy.eyebrow}
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--editorial-text)] md:text-6xl">
                          {caseStudy.title}
                        </h1>
                        <p className="mt-4 text-[0.95rem] leading-7 text-[var(--editorial-text)]">
                          {caseStudy.summary}
                        </p>
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
                  <AnimatedCard delay={0.18}>
                    <div className="editorial-card rounded-xl border p-5 sm:p-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--editorial-border)]">
                          <CircleAlert className="size-4" />
                        </span>
                        <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                          Challenge
                        </p>
                      </div>
                      <p className="mt-4 text-[0.95rem] leading-7 text-[var(--editorial-text)]">
                        {caseStudy.challenge}
                      </p>
                    </div>
                  </AnimatedCard>

                  <AnimatedCard delay={0.22}>
                    <div className="editorial-card rounded-xl border p-5 sm:p-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-8 items-center justify-center rounded-full border border-[color:var(--editorial-border)]">
                          <Sparkles className="size-4" />
                        </span>
                        <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                          Outcome
                        </p>
                      </div>
                      <p className="mt-4 text-[0.95rem] leading-7 text-[var(--editorial-text)]">
                        {caseStudy.outcome}
                      </p>
                    </div>
                  </AnimatedCard>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                  {["Discovery", "Build", "Launch"].map((label, index) => (
                    <AnimatedCard
                      key={label}
                      delay={0.26 + index * 0.05}
                    >
                      <div className="editorial-card rounded-xl border p-5 sm:p-6">
                        <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                          0{index + 1}
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-[var(--editorial-text)]">
                          {label}
                        </h2>
                        <p className="mt-3 text-[0.92rem] leading-7 text-[var(--editorial-text)]">
                          Placeholder detail text for the {label.toLowerCase()}{" "}
                          stage. Use this section to explain the goals,
                          tradeoffs, and decisions that shaped the final result.
                        </p>
                      </div>
                    </AnimatedCard>
                  ))}
                </section>

                <AnimatedCard delay={0.42}>
                  <section className="editorial-card rounded-xl border p-6 sm:p-8">
                    <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                      Notes
                    </p>
                    <div className="mt-5 space-y-5 text-[0.95rem] leading-7 text-[var(--editorial-text)]">
                      <p>
                        This is placeholder long-form copy for the case study
                        body. It gives you room to describe the brief, the
                        product constraints, and the decisions that mattered
                        most during execution.
                      </p>
                      <p>
                        You can also use this section for artifacts,
                        screenshots, architecture notes, launch learnings, or
                        product outcomes.
                      </p>
                      <p>
                        The page is intentionally scrollable, and the chat
                        stays fixed at the bottom so visitors can read first and
                        ask questions whenever they are ready.
                      </p>
                    </div>
                  </section>
                </AnimatedCard>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </article>

      <CaseStudyChat
        id={chatId}
        promptHint={caseStudy.prompt}
        pageContext={{ type: "case-study", slug: caseStudy.slug }}
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
