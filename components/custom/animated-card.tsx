"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedCard({
  children,
  className,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
