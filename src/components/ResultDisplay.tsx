"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PenaltyOutcome } from "@/lib/types";

type ResultDisplayProps = {
  outcome: PenaltyOutcome | null;
  visible: boolean;
};

const RESULT_CONFIG: Record<
  PenaltyOutcome,
  { text: string; color: string; bg: string; accent: string }
> = {
  goal: {
    text: "GOAL",
    color: "#76ff03",
    bg: "rgba(118, 255, 3, 0.08)",
    accent: "rgba(118, 255, 3, 0.5)",
  },
  saved: {
    text: "SAVED",
    color: "#ff6b6b",
    bg: "rgba(255, 107, 107, 0.08)",
    accent: "rgba(255, 107, 107, 0.5)",
  },
  miss: {
    text: "MISSED",
    color: "#888888",
    bg: "rgba(136, 136, 136, 0.06)",
    accent: "rgba(136, 136, 136, 0.3)",
  },
};

export default function ResultDisplay({ outcome, visible }: ResultDisplayProps) {
  return (
    <AnimatePresence>
      {visible && outcome && (
        <motion.div
          key={outcome + Date.now()}
          className="relative w-full max-w-[640px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Lower-third bar */}
          <motion.div
            className="relative flex items-center h-14 rounded-lg overflow-hidden"
            style={{ backgroundColor: RESULT_CONFIG[outcome].bg }}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left accent bar */}
            <motion.div
              className="w-1.5 h-full rounded-l-lg"
              style={{ backgroundColor: RESULT_CONFIG[outcome].color }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            />

            {/* Result text */}
            <motion.span
              className="font-heading text-4xl tracking-[0.25em] ml-5"
              style={{
                color: RESULT_CONFIG[outcome].color,
                textShadow: `0 0 20px ${RESULT_CONFIG[outcome].accent}`,
              }}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
            >
              {RESULT_CONFIG[outcome].text}
            </motion.span>

            {/* Right-side decorative line */}
            <motion.div
              className="absolute right-0 top-0 h-full w-px"
              style={{ backgroundColor: RESULT_CONFIG[outcome].accent }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
