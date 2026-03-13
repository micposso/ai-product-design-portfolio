"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SlashIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-30 flex flex-row items-center justify-between bg-background/92 px-3 py-2 backdrop-blur-sm"
    >
        <div className="flex flex-row gap-3 items-center">
          <Link
            href="/"
            className="flex flex-row items-center gap-2 rounded-full p-1 transition hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80"
          >
            <Image
              src="/images/michael-pixel-avatar.svg"
              height={20}
              width={20}
              alt="Pixel portrait of Michael Posso"
            />
            <div className="text-zinc-500">
              <SlashIcon size={16} />
            </div>
            <div className="text-sm dark:text-zinc-300 truncate w-52 md:w-fit">
              Michael Posso | AI Product Engineer
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-zinc-300 bg-transparent px-4 dark:border-zinc-700"
          >
            <Link href="/insights">Insights</Link>
          </Button>
          <ThemeToggle />
        </div>
    </motion.div>
  );
};
