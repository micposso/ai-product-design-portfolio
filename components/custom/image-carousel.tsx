"use client";

import {
  type Message,
} from "ai";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { caseStudies } from "@/lib/case-studies";

import { Button } from "../ui/button";

export function ImageCarousel({
  messages,
}: {
  messages: Array<Message>;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const getScrollAmount = () => {
    const container = scrollerRef.current;

    if (!container) {
      return 0;
    }

    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.clientWidth ?? 0;
    const gap = Number.parseInt(
      window.getComputedStyle(container).columnGap || "16",
      10,
    );

    return cardWidth + gap;
  };

  const scrollByAmount = (direction: "left" | "right") => {
    const container = scrollerRef.current;

    if (!container) {
      return;
    }

    const scrollAmount = getScrollAmount();
    const amount = direction === "left" ? -scrollAmount : scrollAmount;

    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollerRef.current;

    if (!container) {
      return;
    }

    const interval = window.setInterval(() => {
      const scrollAmount = getScrollAmount();

      if (scrollAmount === 0) {
        return;
      }

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const nextScrollLeft = container.scrollLeft + scrollAmount;

      if (nextScrollLeft >= maxScrollLeft - 4) {
        container.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }, 3500);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex min-w-0 w-full flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <div className="w-full border-l border-[color:var(--editorial-border)] pl-4">
          <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
            Case studies
          </p>
          <h2 className="mt-1 text-base font-normal leading-7 text-[var(--editorial-text)]">
            Browse the work and continue the conversation project by project
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="editorial-card hidden shrink-0 rounded-full border md:flex"
          onClick={() => scrollByAmount("left")}
          aria-label="Scroll carousel left"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div
          ref={scrollerRef}
          className={`flex min-w-0 w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            messages.length === 0 ? "justify-start" : ""
          }`}
        >
          {caseStudies.map((card, index) => (
            <Link
              key={card.slug}
              href={`/case-study/${card.slug}`}
              className="group relative w-[min(18rem,calc(100%-0.5rem))] min-w-[min(18rem,calc(100%-0.5rem))] max-w-full shrink-0 snap-start overflow-hidden rounded-xl border border-[color:var(--editorial-border)] text-left shadow-[var(--editorial-shadow)] transition duration-300 hover:-translate-y-1 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-[320px] sm:min-w-[320px] md:w-[calc((100%-2rem)/3)] md:min-w-[calc((100%-2rem)/3)]"
            >
              <div className="relative h-[240px] w-full overflow-hidden rounded-xl sm:h-[272px]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 639px) calc(100vw - 4rem), (max-width: 767px) 320px, 280px"
                  className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-[0.42]"
                  priority={index === 0}
                />
                <div className="absolute inset-0 z-10 bg-black/36 transition duration-300 md:bg-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-0 flex-col gap-1 p-4 opacity-100 transition duration-300 md:translate-y-4 md:p-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <h3 className="text-lg font-medium leading-6 text-white sm:text-xl">
                    {card.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="editorial-card hidden shrink-0 rounded-full border md:flex"
          onClick={() => scrollByAmount("right")}
          aria-label="Scroll carousel right"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
