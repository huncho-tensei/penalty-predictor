"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PenaltyOutcome } from "@/lib/types";

type ResultDisplayProps = {
  outcome: PenaltyOutcome | null;
  visible: boolean;
};

const RESULT_CONFIG: Record<
  PenaltyOutcome,
  { text: string; color: string; glow: string; flash: string }
> = {
  goal: {
    text: "GOAL!",
    color: "#76ff03",
    glow: "0 0 40px rgba(118, 255, 3, 0.7), 0 0 80px rgba(118, 255, 3, 0.3)",
    flash: "rgba(118, 255, 3, 0.15)",
  },
  saved: {
    text: "SAVED!",
    color: "#ff6b6b",
    glow: "0 0 40px rgba(255, 107, 107, 0.7), 0 0 80px rgba(255, 107, 107, 0.3)",
    flash: "rgba(255, 107, 107, 0.12)",
  },
  miss: {
    text: "MISS!",
    color: "#888888",
    glow: "0 0 20px rgba(136, 136, 136, 0.4)",
    flash: "rgba(136, 136, 136, 0.06)",
  },
};

export default function ResultDisplay({ outcome, visible }: ResultDisplayProps) {
  if (!visible || !outcome) return null;

  const config = RESULT_CONFIG[outcome];

  return (
    <AnimatePresence>
      <div className="relative">
        {/* Screen flash overlay */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ backgroundColor: config.flash }}
        />

        {/* Result text */}
        <motion.div
          initial={{ scale: 3, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="font-heading text-7xl sm:text-8xl tracking-wider text-center select-none"
          style={{
            color: config.color,
            textShadow: config.glow,
            WebkitTextStroke: `2px ${config.color}`,
            paintOrder: "stroke fill",
          }}
        >
          {config.text}
        </motion.div>

        {/* Expanding ring behind text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
          initial={{ scale: 0.5, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="w-32 h-32 rounded-full border-2"
            style={{ borderColor: config.color }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
