"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SimulationResult, ZoneDistribution } from "@/lib/types";

type PenaltyAnimationProps = {
  result: SimulationResult | null;
  isPlaying: boolean;
};

const ZONE_TARGETS: Record<keyof ZoneDistribution, { x: number; y: number }> = {
  topLeft:      { x: 110, y: 75 },
  topCenter:    { x: 270, y: 75 },
  topRight:     { x: 430, y: 75 },
  bottomLeft:   { x: 110, y: 165 },
  bottomCenter: { x: 270, y: 165 },
  bottomRight:  { x: 430, y: 165 },
};

const MISS_TARGETS: Record<string, { x: number; y: number }> = {
  "left-post":  { x: 30, y: 120 },
  "right-post": { x: 510, y: 120 },
  "crossbar":   { x: 270, y: 5 },
  "over":       { x: 270, y: -40 },
};

const BALL_START = { x: 270, y: 280 };

export default function PenaltyAnimation({ result, isPlaying }: PenaltyAnimationProps) {
  if (!result || !isPlaying) return null;

  const ballTarget =
    result.outcome === "miss" && result.missType
      ? MISS_TARGETS[result.missType]
      : ZONE_TARGETS[result.takerZone];

  const keeperTarget = ZONE_TARGETS[result.keeperZone];

  const keeperStartX = 270;
  const keeperStartY = 145;

  return (
    <AnimatePresence>
      <g>
        {/* Ball */}
        <motion.circle
          cx={BALL_START.x}
          cy={BALL_START.y}
          r={8}
          fill="white"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={1}
          initial={{ cx: BALL_START.x, cy: BALL_START.y, opacity: 1 }}
          animate={{
            cx: ballTarget.x,
            cy: ballTarget.y,
            opacity: result.outcome === "miss" ? [1, 1, 0] : 1,
          }}
          transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
        />

        {/* Keeper gloves */}
        <motion.g
          initial={{ x: 0, y: 0 }}
          animate={{
            x: keeperTarget.x - keeperStartX,
            y: keeperTarget.y - keeperStartY,
          }}
          transition={{ duration: 0.35, delay: 0.7, ease: "easeOut" }}
        >
          {/* Left glove */}
          <rect
            x={keeperStartX - 18}
            y={keeperStartY - 8}
            width={14}
            height={16}
            rx={4}
            fill="#ffd700"
            opacity={0.9}
          />
          {/* Right glove */}
          <rect
            x={keeperStartX + 4}
            y={keeperStartY - 8}
            width={14}
            height={16}
            rx={4}
            fill="#ffd700"
            opacity={0.9}
          />
        </motion.g>
      </g>
    </AnimatePresence>
  );
}
