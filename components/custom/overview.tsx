"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

import { SidebarAudioPlayer } from "./sidebar-audio-player";
import { SidebarBrandCard } from "./sidebar-brand-card";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";

export const Overview = ({
  children,
  carousel,
  expanded = false,
  panelTitle,
}: {
  children: ReactNode;
  carousel?: ReactNode;
  expanded?: boolean;
  panelTitle?: ReactNode;
}) => {
  return (
    <section className="w-full p-3 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.02 }}
          className="flex items-center gap-3"
        >
          <div className="min-w-0 flex-1 lg:ml-auto lg:max-w-xs">
            <SidebarAudioPlayer />
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col justify-center gap-4"
          >
            <SidebarBrandCard />
          </motion.div>

          <div className="flex min-h-0 flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.04 }}
              className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
            >
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="editorial-sans rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] hover:opacity-95 dark:border-transparent"
                >
                  <Link href="/">Home</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="editorial-card editorial-sans rounded-full px-4 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
                >
                  <Link href="/case-study">Products</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="editorial-card editorial-sans rounded-full px-4 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
                >
                  <Link href="/insights">Insights</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="editorial-card editorial-sans rounded-full px-4 text-xs font-semibold uppercase tracking-[0.16em] transition hover:brightness-110"
                >
                  <Link href="/education">Education</Link>
                </Button>
              </div>

            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 32 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                opacity: { duration: 0.65, ease: "easeOut", delay: 0.08 },
                y: { duration: 0.65, ease: "easeOut", delay: 0.08 },
                layout: {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="overflow-hidden rounded-2xl bg-[var(--editorial-shell)] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]"
            >
              <div className="flex h-full flex-col gap-2 p-2">
                {panelTitle ? (
                  <div className="flex shrink-0 px-1 pt-1">{panelTitle}</div>
                ) : null}
                <motion.div
                  layout
                  animate={{ y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-0 flex-1 w-full overflow-hidden rounded-xl border border-[color:var(--editorial-border)] bg-[var(--editorial-subtle-surface)] p-2 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] sm:p-3"
                >
                  {children}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {carousel ? (
          <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="hidden lg:block" />
            <div className="flex flex-col gap-4">
              <motion.div
                animate={{ y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="editorial-card flex min-h-0 w-full rounded-xl border p-2.5 sm:p-3"
              >
                <div className="min-w-0 w-full overflow-visible">{carousel}</div>
              </motion.div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
