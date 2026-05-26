"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SimulationResult, ZoneDistribution } from "@/lib/types";
import { ZONE_POS, SVG_W, GOAL_BOUNDS } from "./GoalVisualization";

type PenaltyAnimationProps = {
  result: SimulationResult | null;
  isPlaying: boolean;
};

const BALL_START = { x: SVG_W / 2, y: 330 };

const MISS_TARGETS: Record<string, { x: number; y: number }> = {
  "left-post":  { x: GOAL_BOUNDS.x - 3, y: GOAL_BOUNDS.y + GOAL_BOUNDS.h * 0.5 },
  "right-post": { x: GOAL_BOUNDS.x + GOAL_BOUNDS.w + 3, y: GOAL_BOUNDS.y + GOAL_BOUNDS.h * 0.5 },
  "crossbar":   { x: SVG_W / 2, y: GOAL_BOUNDS.y - 3 },
  "over":       { x: SVG_W / 2 + (Math.random() - 0.5) * 40, y: -30 },
};

const KEEPER_CENTER = { x: SVG_W / 2, y: GOAL_BOUNDS.y + GOAL_BOUNDS.h * 0.52 };

const TOP_ZONES: (keyof ZoneDistribution)[] = ["topLeft", "topCenter", "topRight"];

function isRocket(zone: keyof ZoneDistribution): boolean {
  return TOP_ZONES.includes(zone);
}

export default function PenaltyAnimation({ result, isPlaying }: PenaltyAnimationProps) {
  if (!result || !isPlaying) return null;

  const isMiss = result.outcome === "miss";
  const isPostMiss = isMiss && result.missType !== "over";
  const isGoal = result.outcome === "goal";

  const target = isMiss && result.missType
    ? MISS_TARGETS[result.missType]
    : ZONE_POS[result.takerZone];

  const tx = ("cx" in target) ? (target as { cx: number }).cx : (target as { x: number }).x;
  const ty = ("cy" in target) ? (target as { cy: number }).cy : (target as { y: number }).y;

  const rocket = !isMiss && isRocket(result.takerZone);
  const ballDuration = rocket ? 0.28 : 0.38;
  const ballEase = rocket ? [0.1, 0, 0.3, 1] : [0.4, 0, 0.2, 1];

  // Curve offset for non-rocket shots
  const curveX = rocket ? 0 : (tx < SVG_W / 2 ? 30 : tx > SVG_W / 2 ? -30 : 0);

  const keeperTarget = ZONE_POS[result.keeperZone];
  const diveX = keeperTarget.cx - KEEPER_CENTER.x;
  const diveY = (keeperTarget.cy - KEEPER_CENTER.y) * 0.5;
  const diveRotation = diveX < -30 ? -30 : diveX > 30 ? 30 : diveX < -10 ? -12 : diveX > 10 ? 12 : 0;

  return (
    <AnimatePresence>
      <g>
        {/* Ball trail — straight for rockets, curved for benders */}
        {rocket ? (
          <motion.line
            x1={BALL_START.x} y1={BALL_START.y}
            x2={BALL_START.x} y2={BALL_START.y}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ x2: BALL_START.x, y2: BALL_START.y }}
            animate={{ x2: tx, y2: ty }}
            transition={{ duration: ballDuration, delay: 0.7, ease: ballEase as never }}
          />
        ) : (
          <motion.path
            d={`M ${BALL_START.x} ${BALL_START.y} Q ${BALL_START.x + curveX} ${(BALL_START.y + ty) / 2} ${tx} ${ty}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: ballDuration, delay: 0.7, ease: ballEase as never }}
          />
        )}

        {/* Ball */}
        <motion.g
          initial={{ x: BALL_START.x, y: BALL_START.y }}
          animate={{ x: tx, y: ty }}
          transition={{ duration: ballDuration, delay: 0.7, ease: ballEase as never }}
        >
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: rocket ? 900 : 540 }}
            transition={{ duration: ballDuration + 0.1, delay: 0.7, ease: "linear" }}
          >
            {/* Ball body */}
            <circle r={7} fill="white" />
            <circle r={7} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5} />
            <circle r={2.5} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={0.8} />
            <line x1={-1.5} y1={-6} x2={-3.5} y2={-2.5} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />
            <line x1={1.5} y1={-6} x2={3.5} y2={-2.5} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />
            <line x1={-5.5} y1={2} x2={-1.5} y2={2.5} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />
            <line x1={5.5} y1={2} x2={1.5} y2={2.5} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />
          </motion.g>

          {/* Speed lines for rockets */}
          {rocket && (
            <>
              <motion.line
                x1={-3} y1={10} x2={-5} y2={22}
                stroke="rgba(255,255,255,0.15)" strokeWidth={1}
                initial={{ opacity: 1 }} animate={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.75 }}
              />
              <motion.line
                x1={3} y1={10} x2={5} y2={22}
                stroke="rgba(255,255,255,0.15)" strokeWidth={1}
                initial={{ opacity: 1 }} animate={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.75 }}
              />
            </>
          )}
        </motion.g>

        {/* Impact: net ripple + glow (goals only) */}
        {isGoal && (
          <>
            {/* Glow ring */}
            <motion.circle
              cx={tx} cy={ty} r={0}
              fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2}
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: 30, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.5, delay: 0.7 + ballDuration }}
            />
            {/* Net ripple — expanding ring with net color */}
            <motion.circle
              cx={tx} cy={ty} r={0}
              fill="none" stroke="rgba(200,200,200,0.12)" strokeWidth={1}
              initial={{ r: 5 }}
              animate={{ r: 50, opacity: [0.3, 0] }}
              transition={{ duration: 0.6, delay: 0.7 + ballDuration + 0.05 }}
            />
            <motion.circle
              cx={tx} cy={ty} r={0}
              fill="none" stroke="rgba(200,200,200,0.08)" strokeWidth={1}
              initial={{ r: 5 }}
              animate={{ r: 40, opacity: [0.2, 0] }}
              transition={{ duration: 0.5, delay: 0.7 + ballDuration + 0.15 }}
            />
          </>
        )}

        {/* Post flash on post/crossbar miss */}
        {isPostMiss && (
          <>
            <motion.circle
              cx={tx} cy={ty} r={0}
              fill="none" stroke="#ffd700" strokeWidth={2.5}
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: 20, opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.25, delay: 0.7 + ballDuration }}
            />
            <motion.circle
              cx={tx} cy={ty} r={3}
              fill="#ffd700"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.15, delay: 0.7 + ballDuration }}
            />
          </>
        )}

        {/* Keeper silhouette */}
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: diveX, y: diveY, rotate: diveRotation }}
          transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: `${KEEPER_CENTER.x}px ${KEEPER_CENTER.y}px` }}
        >
          {/* Body */}
          <rect
            x={KEEPER_CENTER.x - 5} y={KEEPER_CENTER.y - 20}
            width={10} height={28} rx={3}
            fill="#ffd700" opacity={0.65}
          />
          {/* Head */}
          <circle cx={KEEPER_CENTER.x} cy={KEEPER_CENTER.y - 26} r={6} fill="#ffd700" opacity={0.65} />
          {/* Left arm */}
          <motion.line
            x1={KEEPER_CENTER.x - 5} y1={KEEPER_CENTER.y - 13}
            x2={KEEPER_CENTER.x - 20} y2={KEEPER_CENTER.y - 28}
            stroke="#ffd700" strokeWidth={3.5} strokeLinecap="round" opacity={0.65}
            initial={{ x2: KEEPER_CENTER.x - 12, y2: KEEPER_CENTER.y - 16 }}
            animate={{ x2: KEEPER_CENTER.x - 26, y2: KEEPER_CENTER.y - 34 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          />
          {/* Right arm */}
          <motion.line
            x1={KEEPER_CENTER.x + 5} y1={KEEPER_CENTER.y - 13}
            x2={KEEPER_CENTER.x + 20} y2={KEEPER_CENTER.y - 28}
            stroke="#ffd700" strokeWidth={3.5} strokeLinecap="round" opacity={0.65}
            initial={{ x2: KEEPER_CENTER.x + 12, y2: KEEPER_CENTER.y - 16 }}
            animate={{ x2: KEEPER_CENTER.x + 26, y2: KEEPER_CENTER.y - 34 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          />
          {/* Left glove */}
          <motion.circle
            r={4.5} fill="#ffe44d" opacity={0.85}
            initial={{ cx: KEEPER_CENTER.x - 12, cy: KEEPER_CENTER.y - 16 }}
            animate={{ cx: KEEPER_CENTER.x - 26, cy: KEEPER_CENTER.y - 34 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          />
          {/* Right glove */}
          <motion.circle
            r={4.5} fill="#ffe44d" opacity={0.85}
            initial={{ cx: KEEPER_CENTER.x + 12, cy: KEEPER_CENTER.y - 16 }}
            animate={{ cx: KEEPER_CENTER.x + 26, cy: KEEPER_CENTER.y - 34 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          />
        </motion.g>
      </g>
    </AnimatePresence>
  );
}
