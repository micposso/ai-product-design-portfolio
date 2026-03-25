"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { SidebarBrandCard } from "@/components/custom/sidebar-brand-card";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { caseStudies } from "@/lib/case-studies";

const featuredCaseStudies = caseStudies.slice(0, 3);

export default function Page() {
  return (
    <div className="px-4 pb-6 md:px-6 md:pb-8">
      <main className="mx-auto flex w-full max-w-screen-xl flex-col p-4 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex flex-col justify-center gap-4">
            <SidebarBrandCard />
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <Link
                  href="/"
                  className="editorial-card editorial-sans inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
                >
                  Home
                </Link>
                <Link
                  href="/case-study"
                  className="editorial-sans inline-flex rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)]"
                >
                  Products
                </Link>
                <Link
                  href="/insights"
                  className="editorial-card editorial-sans inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
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
              <div className="self-end sm:ml-auto sm:self-auto shrink-0">
                <ThemeToggle />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
              className="overflow-hidden rounded-2xl bg-[var(--editorial-shell)] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]"
            >
              <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-8">
                <section className="max-w-3xl border-l border-[color:var(--editorial-border)] pl-4">
                  <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                    Case Studies
                  </p>
                  <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-[var(--editorial-text)] sm:text-4xl md:text-6xl">
                    Featured product
                    <br />
                    and AI case studies.
                  </h1>
                  <p className="editorial-muted mt-4 max-w-2xl text-base leading-8 md:text-lg">
                    A tighter look at selected work across voice interfaces,
                    product systems, and launches from prototype to production.
                  </p>
                </section>

                <section className="grid gap-4">
                  {featuredCaseStudies.map((caseStudy, index) => (
                    <motion.div
                      key={caseStudy.slug}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 0.06 * index,
                      }}
                    >
                      <Link
                        href={`/case-study/${caseStudy.slug}`}
                        className="editorial-card block rounded-xl border p-4 transition hover:-translate-y-0.5 hover:brightness-110 sm:p-5"
                      >
                        <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[color:var(--editorial-border)]">
                            <Image
                              src={caseStudy.image}
                              alt={caseStudy.title}
                              fill
                              sizes="(max-width: 639px) 100vw, 180px"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1914]/22 via-transparent to-transparent" />
                          </div>

                          <div className="case-study-card-copy min-w-0">
                            <div className="editorial-subtle flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em]">
                              <span className="editorial-sans font-semibold">
                                {caseStudy.eyebrow}
                              </span>
                              <span className="editorial-sans font-semibold">
                                Case study
                              </span>
                            </div>
                            <h2 className="mt-4 break-words text-2xl font-bold text-[var(--editorial-text)]">
                              {caseStudy.title}
                            </h2>
                            <p className="editorial-muted mt-3 max-w-3xl text-base leading-8">
                              {caseStudy.summary}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
