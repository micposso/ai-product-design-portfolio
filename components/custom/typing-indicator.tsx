"use client";

import { motion } from "framer-motion";

import { BotIcon } from "./icons";

export function TypingIndicator() {
  return (
    <motion.div
      className="flex w-full max-w-[500px] flex-row gap-4 px-4 md:px-0"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex size-[24px] shrink-0 items-center justify-center rounded-sm border p-1 text-zinc-500">
        <BotIcon />
      </div>

      <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="size-2 rounded-full bg-zinc-500/80 dark:bg-zinc-300/80"
            animate={{
              opacity: [0.35, 1, 0.35],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
