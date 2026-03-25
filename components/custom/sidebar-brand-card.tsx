"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const currentFocusText =
  "Product engineering for voice interfaces, enterprise CMS, and agentic systems";

export function SidebarBrandCard() {
  const [typedCurrentFocus, setTypedCurrentFocus] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedCurrentFocus(currentFocusText.slice(0, index));

      if (index >= currentFocusText.length) {
        window.clearInterval(timer);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="editorial-card min-w-0 w-full rounded-xl border p-5 [container-type:inline-size] sm:h-[238px] sm:min-w-[220px]">
      <Link
        href="/"
        className="flex w-full max-w-full items-center justify-between gap-3 sm:gap-4"
      >
        <span className="font-display block min-w-0 flex-1 text-[clamp(1.55rem,12vw,3.1rem)] font-normal leading-none tracking-[-0.06em] text-[var(--editorial-text)] sm:text-[clamp(1rem,17cqw,3.1rem)]">
          <span className="block">
            Michael<wbr />Posso.ai
          </span>
        </span>
        <span className="flex shrink-0 justify-center self-center sm:block">
          <span className="relative aspect-square w-[clamp(3.5rem,22vw,4.75rem)] overflow-hidden rounded-full border border-[color:var(--editorial-border)] bg-[var(--editorial-shell)] shadow-[0_26px_70px_-38px_rgba(28,23,19,0.35)] sm:w-[clamp(4.5rem,24cqw,6rem)]">
            <Image
              src="/images/profile.jpg"
              alt="Michael Posso"
              fill
              sizes="(max-width: 639px) 56px, (max-width: 1023px) 88px, 96px"
              className="object-cover object-center"
              priority
            />
          </span>
        </span>
      </Link>

      <div className="mt-5 space-y-4">
        <div className="border-l border-[color:var(--editorial-border)] pl-4 text-sm text-[var(--editorial-text)]">
          <p className="editorial-sans editorial-subtle text-xs font-semibold uppercase tracking-[0.18em]">
            Current focus
          </p>
          <p className="mt-1 break-words leading-6 text-[var(--editorial-text)]">
            {typedCurrentFocus}
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="ml-0.5 inline-block"
            >
              |
            </motion.span>
          </p>
        </div>
      </div>
    </div>
  );
}
