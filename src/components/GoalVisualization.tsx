"use client";

import type { Player, PenaltyDot, ZoneDistribution } from "@/lib/types";
import HexZone from "./HexZone";

type GoalVisualizationProps = {
  taker: Player | null;
  keeper: Player | null;
  dots: PenaltyDot[];
  showOverlay: boolean;
};

const GOAL_WIDTH = 480;
const GOAL_HEIGHT = 200;
const POST_WIDTH = 6;
const PAD_X = 30;
const PAD_Y = 20;

const HEX_SIZE = 38;

const ZONE_POSITIONS: Record<keyof ZoneDistribution, { cx: number; cy: number }> = {
  topLeft:      { cx: PAD_X + 80,  cy: PAD_Y + 55 },
  topCenter:    { cx: PAD_X + 240, cy: PAD_Y + 55 },
  topRight:     { cx: PAD_X + 400, cy: PAD_Y + 55 },
  bottomLeft:   { cx: PAD_X + 80,  cy: PAD_Y + 145 },
  bottomCenter: { cx: PAD_X + 240, cy: PAD_Y + 145 },
  bottomRight:  { cx: PAD_X + 400, cy: PAD_Y + 145 },
};

function dotColor(outcome: string): string {
  if (outcome === "goal") return "#76ff03";
  if (outcome === "saved") return "#ff6b6b";
  return "#666666";
}

function dotPosition(dot: PenaltyDot): { x: number; y: number } {
  const zone = ZONE_POSITIONS[dot.zone];
  if (!zone) return { x: PAD_X + 240, y: PAD_Y + 100 };
  const offsetX = (Math.random() - 0.5) * 20;
  const offsetY = (Math.random() - 0.5) * 20;
  return { x: zone.cx + offsetX, y: zone.cy + offsetY };
}

export default function GoalVisualization({
  taker,
  keeper,
  dots,
  showOverlay,
}: GoalVisualizationProps) {
  const svgWidth = GOAL_WIDTH + PAD_X * 2;
  const svgHeight = GOAL_HEIGHT + PAD_Y * 2;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-[600px]"
    >
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#ffd700" floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Goal frame with neon glow */}
      <g filter="url(#neon-glow)">
        {/* Crossbar */}
        <rect
          x={PAD_X}
          y={PAD_Y}
          width={GOAL_WIDTH}
          height={POST_WIDTH}
          fill="#ffd700"
          rx={2}
        />
        {/* Left post */}
        <rect
          x={PAD_X}
          y={PAD_Y}
          width={POST_WIDTH}
          height={GOAL_HEIGHT}
          fill="#ffd700"
          rx={2}
        />
        {/* Right post */}
        <rect
          x={PAD_X + GOAL_WIDTH - POST_WIDTH}
          y={PAD_Y}
          width={POST_WIDTH}
          height={GOAL_HEIGHT}
          fill="#ffd700"
          rx={2}
        />
      </g>

      {/* Net lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={PAD_X + POST_WIDTH + ((GOAL_WIDTH - POST_WIDTH * 2) / 11) * i}
          y1={PAD_Y + POST_WIDTH}
          x2={PAD_X + POST_WIDTH + ((GOAL_WIDTH - POST_WIDTH * 2) / 11) * i}
          y2={PAD_Y + GOAL_HEIGHT}
          stroke="rgba(255, 215, 0, 0.06)"
          strokeWidth={0.5}
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={PAD_X + POST_WIDTH}
          y1={PAD_Y + POST_WIDTH + ((GOAL_HEIGHT - POST_WIDTH) / 4) * i}
          x2={PAD_X + GOAL_WIDTH - POST_WIDTH}
          y2={PAD_Y + POST_WIDTH + ((GOAL_HEIGHT - POST_WIDTH) / 4) * i}
          stroke="rgba(255, 215, 0, 0.06)"
          strokeWidth={0.5}
        />
      ))}

      {/* Hex zones */}
      {taker && keeper && (
        <g>
          {(Object.keys(ZONE_POSITIONS) as (keyof ZoneDistribution)[]).map(
            (zone) => (
              <HexZone
                key={zone}
                zone={zone}
                takerProb={taker.zones[zone]}
                keeperProb={keeper.zones[zone]}
                cx={ZONE_POSITIONS[zone].cx}
                cy={ZONE_POSITIONS[zone].cy}
                size={HEX_SIZE}
                showOverlay={showOverlay}
              />
            )
          )}
        </g>
      )}

      {/* Penalty dots */}
      {dots.map((dot) => {
        const pos = dotPosition(dot);
        return (
          <circle
            key={dot.id}
            cx={pos.x}
            cy={pos.y}
            r={5}
            fill={dotColor(dot.outcome)}
            opacity={0.85}
            stroke="rgba(0,0,0,0.5)"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}
