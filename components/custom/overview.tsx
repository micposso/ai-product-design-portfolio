"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";

const leftRailItems = [
  {
    label: "Current focus",
    value: "AI products, launch systems, and design engineering",
  },
  {
    label: "Best for",
    value: "Founders, product teams, and operators shaping a next release",
  },
];

export const Overview = ({
  children,
  carousel,
}: {
  children: ReactNode;
  carousel?: ReactNode;
}) => {
  return (
    <section className="w-full p-4 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col justify-center gap-4"
          >
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
                {leftRailItems.map((item) => (
                  <div
                    key={item.label}
                    className="border-l border-white/25 pl-4 text-sm text-white"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                      {item.label}
                    </p>
                    <p className="mt-1 leading-6 text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden rounded-xl border border-white/55 bg-white/55 px-5 py-3 text-center text-sm text-[#4b3d31] shadow-[0_16px_40px_-28px_rgba(20,16,12,0.3)] md:block">
              Ask the portfolio like a live collaborator.
            </div>
          </motion.div>

          <div className="flex min-h-0 flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.04 }}
              className="flex w-full items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] hover:opacity-95 dark:border-transparent"
                >
                  <Link href="/case-study/product-systems">Products</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full border-transparent bg-[var(--color-brand-primary)] px-4 text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] hover:opacity-95 dark:border-transparent"
                >
                  <Link href="/insights">Insights</Link>
                </Button>
              </div>

              <ThemeToggle />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
              className="h-[440px] overflow-hidden rounded-2xl bg-[#f7f1ea] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]"
            >
              <div className="flex h-full flex-col p-2">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="flex min-h-0 flex-1 w-full overflow-hidden rounded-xl bg-white/72 p-2 shadow-[0_26px_80px_-42px_rgba(23,18,13,0.18)] backdrop-blur-sm sm:p-3"
                >
                  {children}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {carousel ? (
          <div className="flex flex-col gap-4 p-2">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="flex min-h-0 w-full rounded-xl bg-white/72 p-3 shadow-[0_26px_80px_-42px_rgba(23,18,13,0.18)] backdrop-blur-sm sm:p-4"
            >
              <div className="w-full">{carousel}</div>
            </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
