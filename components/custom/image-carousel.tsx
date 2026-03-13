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
    <div className="mb-6 flex w-full max-w-[920px] flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Featured Work
          </p>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Explore recent builds
          </h2>
        </div>

      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden shrink-0 rounded-full bg-background/85 backdrop-blur md:flex"
          onClick={() => scrollByAmount("left")}
          aria-label="Scroll carousel left"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div
          ref={scrollerRef}
          className={`flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            messages.length === 0 ? "justify-start" : ""
          }`}
        >
          {caseStudies.map((card, index) => (
            <Link
              key={card.slug}
              href={`/case-study/${card.slug}`}
              className="group relative w-[calc(100%-3rem)] min-w-[260px] snap-start overflow-hidden rounded-[2rem] border border-white/20 text-left shadow-[0_20px_60px_-24px_rgba(15,23,42,0.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-30px_rgba(15,23,42,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-[320px] sm:min-w-[320px] md:w-[calc((100%-2rem)/3)] md:min-w-[calc((100%-2rem)/3)]"
            >
              <div className="relative h-[272px] w-full overflow-hidden rounded-[2rem]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 639px) calc(100vw - 4rem), (max-width: 767px) 320px, 280px"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  priority={index === 0}
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5">
                  <h3 className="text-xl font-medium text-white">{card.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden shrink-0 rounded-full bg-background/85 backdrop-blur md:flex"
          onClick={() => scrollByAmount("right")}
          aria-label="Scroll carousel right"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
