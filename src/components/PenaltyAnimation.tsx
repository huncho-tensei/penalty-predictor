"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SimulationResult, ZoneDistribution } from "@/lib/types";
import { ZONE_POS, SVG_W, GOAL_BOUNDS } from "./GoalVisualization";

type PenaltyAnimationProps = {
  result: SimulationResult | null;
  isPlaying: boolean;
};

const BALL_START = { x: SVG_W / 2, y: 310 };

const MISS_TARGETS: Record<string, { x: number; y: number }> = {
  "left-post":  { x: GOAL_BOUNDS.x - 5, y: GOAL_BOUNDS.y + GOAL_BOUNDS.h * 0.5 },
  "right-post": { x: GOAL_BOUNDS.x + GOAL_BOUNDS.w + 5, y: GOAL_BOUNDS.y + GOAL_BOUNDS.h * 0.5 },
  "crossbar":   { x: SVG_W / 2, y: GOAL_BOUNDS.y - 5 },
  "over":       { x: SVG_W / 2, y: -30 },
};

const KEEPER_CENTER = { x: SVG_W / 2, y: GOAL_BOUNDS.y + GOAL_BOUNDS.h * 0.55 };

function getKeeperDiveX(zone: keyof ZoneDistribution): number {
  const target = ZONE_POS[zone];
  return target.cx - KEEPER_CENTER.x;
}

function getKeeperDiveY(zone: keyof ZoneDistribution): number {
  const target = ZONE_POS[zone];
  return target.cy - KEEPER_CENTER.y;
}

export default function PenaltyAnimation({ result, isPlaying }: PenaltyAnimationProps) {
  if (!result || !isPlaying) return null;

  const ballTarget =
    result.outcome === "miss" && result.missType
      ? MISS_TARGETS[result.missType]
      : ZONE_POS[result.takerZone];

  const isMiss = result.outcome === "miss";
  const isPostMiss = isMiss && (result.missType === "left-post" || result.missType === "right-post" || result.missType === "crossbar");

  const diveX = getKeeperDiveX(result.keeperZone);
  const diveY = getKeeperDiveY(result.keeperZone);
  const diveLeft = diveX < -20;
  const diveRight = diveX > 20;
  const diveRotation = diveLeft ? -25 : diveRight ? 25 : 0;

  return (
    <AnimatePresence>
      <g>
        {/* Ball trail */}
        <motion.line
          x1={BALL_START.x}
          y1={BALL_START.y}
          x2={BALL_START.x}
          y2={BALL_START.y}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ x2: BALL_START.x, y2: BALL_START.y }}
          animate={{ x2: ballTarget.cx ?? ballTarget.x, y2: ballTarget.cy ?? ballTarget.y }}
          transition={{ duration: 0.35, delay: 0.7, ease: "easeOut" }}
        />

        {/* Ball shadow */}
        <motion.ellipse
          cx={BALL_START.x}
          cy={BALL_START.y + 5}
          rx={7}
          ry={3}
          fill="rgba(0,0,0,0.3)"
          initial={{ cx: BALL_START.x, cy: BALL_START.y + 5, rx: 7 }}
          animate={{
            cx: (ballTarget.cx ?? ballTarget.x),
            cy: (ballTarget.cy ?? ballTarget.y) + 5,
            rx: 4,
          }}
          transition={{ duration: 0.35, delay: 0.7, ease: "easeOut" }}
        />

        {/* Ball */}
        <motion.g
          initial={{ x: BALL_START.x, y: BALL_START.y }}
          animate={{
            x: (ballTarget.cx ?? ballTarget.x),
            y: (ballTarget.cy ?? ballTarget.y),
          }}
          transition={{ duration: 0.35, delay: 0.7, ease: "easeOut" }}
        >
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: 720 }}
            transition={{ duration: 0.4, delay: 0.7, ease: "linear" }}
          >
            <circle r={8} fill="white" />
            <circle r={8} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth={0.5} />
            {/* Pentagon pattern on ball */}
            <circle r={3} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
            <line x1={-2} y1={-7} x2={-4} y2={-3} stroke="rgba(0,0,0,0.08)" strokeWidth={0.5} />
            <line x1={2} y1={-7} x2={4} y2={-3} stroke="rgba(0,0,0,0.08)" strokeWidth={0.5} />
            <line x1={-6} y1={2} x2={-2} y2={3} stroke="rgba(0,0,0,0.08)" strokeWidth={0.5} />
            <line x1={6} y1={2} x2={2} y2={3} stroke="rgba(0,0,0,0.08)" strokeWidth={0.5} />
          </motion.g>
        </motion.g>

        {/* Ball glow on impact */}
        {!isMiss && (
          <motion.circle
            cx={ballTarget.cx ?? ballTarget.x}
            cy={ballTarget.cy ?? ballTarget.y}
            r={0}
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth={2}
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: 25, opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.4, delay: 1.05 }}
          />
        )}

        {/* Post flash on post/crossbar miss */}
        {isPostMiss && (
          <motion.circle
            cx={ballTarget.x}
            cy={ballTarget.y}
            r={0}
            fill="none"
            stroke="#ffd700"
            strokeWidth={3}
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: 30, opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.3, delay: 1.05 }}
          />
        )}

        {/* Keeper silhouette */}
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{
            x: diveX,
            y: diveY * 0.6,
            rotate: diveRotation,
          }}
          transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: `${KEEPER_CENTER.x}px ${KEEPER_CENTER.y}px` }}
        >
          {/* Body */}
          <rect
            x={KEEPER_CENTER.x - 6}
            y={KEEPER_CENTER.y - 22}
            width={12}
            height={30}
            rx={4}
            fill="#ffd700"
            opacity={0.7}
          />
          {/* Head */}
          <circle
            cx={KEEPER_CENTER.x}
            cy={KEEPER_CENTER.y - 28}
            r={7}
            fill="#ffd700"
            opacity={0.7}
          />
          {/* Left arm */}
          <motion.line
            x1={KEEPER_CENTER.x - 6}
            y1={KEEPER_CENTER.y - 15}
            x2={KEEPER_CENTER.x - 22}
            y2={KEEPER_CENTER.y - 30}
            stroke="#ffd700"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.7}
            initial={{ x2: KEEPER_CENTER.x - 15, y2: KEEPER_CENTER.y - 18 }}
            animate={{ x2: KEEPER_CENTER.x - 28, y2: KEEPER_CENTER.y - 35 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          />
          {/* Right arm */}
          <motion.line
            x1={KEEPER_CENTER.x + 6}
            y1={KEEPER_CENTER.y - 15}
            x2={KEEPER_CENTER.x + 22}
            y2={KEEPER_CENTER.y - 30}
            stroke="#ffd700"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.7}
            initial={{ x2: KEEPER_CENTER.x + 15, y2: KEEPER_CENTER.y - 18 }}
            animate={{ x2: KEEPER_CENTER.x + 28, y2: KEEPER_CENTER.y - 35 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          />
          {/* Left glove */}
          <motion.circle
            cx={KEEPER_CENTER.x - 22}
            cy={KEEPER_CENTER.y - 30}
            r={5}
            fill="#ffe44d"
            opacity={0.9}
            initial={{ cx: KEEPER_CENTER.x - 15, cy: KEEPER_CENTER.y - 18 }}
            animate={{ cx: KEEPER_CENTER.x - 28, cy: KEEPER_CENTER.y - 35 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          />
          {/* Right glove */}
          <motion.circle
            cx={KEEPER_CENTER.x + 22}
            cy={KEEPER_CENTER.y - 30}
            r={5}
            fill="#ffe44d"
            opacity={0.9}
            initial={{ cx: KEEPER_CENTER.x + 15, cy: KEEPER_CENTER.y - 18 }}
            animate={{ cx: KEEPER_CENTER.x + 28, cy: KEEPER_CENTER.y - 35 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          />
        </motion.g>
      </g>
    </AnimatePresence>
  );
}
