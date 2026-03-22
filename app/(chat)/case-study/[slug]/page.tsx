import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyChat } from "@/components/custom/case-study-chat";
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
    <div className="min-h-dvh bg-background">
      <article className="content-fade-in mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-40 pt-16 md:px-6 md:gap-12 md:pb-40 md:pt-24">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Back to home
        </Link>

        <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-8">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
              {caseStudy.eyebrow}
            </p>
            <h1 className="max-w-2xl text-4xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 md:text-6xl">
              {caseStudy.title}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {caseStudy.summary}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-950 shadow-[0_32px_80px_-42px_rgba(15,23,42,0.65)] dark:border-zinc-800 sm:rounded-[2rem]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={caseStudy.image}
                alt={caseStudy.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="rounded-[1.25rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-[1.75rem] sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Challenge
            </p>
            <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-300">
              {caseStudy.challenge}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-[1.75rem] sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Outcome
            </p>
            <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-300">
              {caseStudy.outcome}
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3 md:gap-6">
          {["Discovery", "Build", "Launch"].map((label, index) => (
            <div
              key={label}
              className="rounded-[1.25rem] border border-zinc-200 bg-muted/30 p-5 dark:border-zinc-800 sm:rounded-[1.75rem] sm:p-6"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                0{index + 1}
              </p>
              <h2 className="mt-3 text-xl font-medium text-zinc-950 dark:text-zinc-100">
                {label}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                Placeholder detail text for the {label.toLowerCase()} stage. Use
                this section to explain the goals, tradeoffs, and decisions that
                shaped the final result.
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-[2rem] sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Notes
          </p>
          <div className="mt-5 space-y-5 text-base leading-8 text-zinc-600 dark:text-zinc-300">
            <p>
              This is placeholder long-form copy for the case study body. It
              gives you room to describe the brief, the product constraints, and
              the decisions that mattered most during execution.
            </p>
            <p>
              You can also use this section for artifacts, screenshots,
              architecture notes, launch learnings, or product outcomes.
            </p>
            <p>
              The page is intentionally scrollable, and the chat stays fixed at
              the bottom so visitors can read first and ask questions whenever
              they are ready.
            </p>
          </div>
        </section>
      </article>

      <CaseStudyChat
        id={chatId}
        promptHint={caseStudy.prompt}
        pageContext={{ type: "case-study", slug: caseStudy.slug }}
      />
    </div>
  );
}
