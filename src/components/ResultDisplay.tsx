"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PenaltyOutcome } from "@/lib/types";

type ResultDisplayProps = {
  outcome: PenaltyOutcome | null;
  visible: boolean;
};

const RESULT_CONFIG: Record<
  PenaltyOutcome,
  { text: string; color: string; glow: string }
> = {
  goal: { text: "GOAL!", color: "#76ff03", glow: "0 0 30px rgba(118, 255, 3, 0.6)" },
  saved: { text: "SAVED!", color: "#ff6b6b", glow: "0 0 30px rgba(255, 107, 107, 0.6)" },
  miss: { text: "MISS!", color: "#666666", glow: "0 0 20px rgba(102, 102, 102, 0.4)" },
};

export default function ResultDisplay({ outcome, visible }: ResultDisplayProps) {
  return (
    <AnimatePresence>
      {visible && outcome && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1.1 }}
          className="font-heading text-6xl tracking-wider text-center"
          style={{
            color: RESULT_CONFIG[outcome].color,
            textShadow: RESULT_CONFIG[outcome].glow,
            WebkitTextStroke: `1.5px ${RESULT_CONFIG[outcome].color}`,
            paintOrder: "stroke fill",
          }}
        >
          {RESULT_CONFIG[outcome].text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
