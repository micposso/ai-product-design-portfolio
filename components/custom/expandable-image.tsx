"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ExpandableImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ExpandableImage({
  src,
  alt,
  className,
}: ExpandableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative block size-full cursor-zoom-in"
        aria-label={`Expand image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 92vw, 768px"
          className={className}
        />
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#18120d]/92 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/16 sm:right-6 sm:top-6"
            aria-label="Close expanded image"
          >
            <X className="size-5" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-[92vw] overflow-hidden rounded-2xl border border-white/10 bg-[#221914] shadow-[0_40px_120px_-36px_rgba(0,0,0,0.65)]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              sizes="92vw"
              className="h-auto max-h-[90vh] max-w-[92vw] object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
