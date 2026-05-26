"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Player, PressureMode, PenaltyDot, SimulationResult } from "@/lib/types";
import { calculateScoreProbability } from "@/lib/probability";
import { simulatePenalty } from "@/lib/simulation";
import MatchupSelector from "@/components/MatchupSelector";
import GoalVisualization from "@/components/GoalVisualization";
import PenaltyAnimation from "@/components/PenaltyAnimation";
import ResultDisplay from "@/components/ResultDisplay";
import PlayerStats from "@/components/PlayerStats";
import PressureToggle from "@/components/PressureToggle";
import FootballerQuote from "@/components/FootballerQuote";
import players from "@/data/players.json";

const typedPlayers = players as Player[];
const takers = typedPlayers.filter((p) => p.role === "taker");
const keepers = typedPlayers.filter((p) => p.role === "keeper");

const MAX_DOTS = 5;

export default function Home() {
  const [taker, setTaker] = useState<Player | null>(null);
  const [keeper, setKeeper] = useState<Player | null>(null);
  const [pressure, setPressure] = useState<PressureMode>("regular");
  const [dots, setDots] = useState<PenaltyDot[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const dotIdRef = useRef(0);

  const hasSelection = taker !== null && keeper !== null;

  const scoreProbability =
    hasSelection ? calculateScoreProbability(taker, keeper, pressure) : null;

  const handleRandomise = useCallback(() => {
    const randomTaker = takers[Math.floor(Math.random() * takers.length)];
    let randomKeeper = keepers[Math.floor(Math.random() * keepers.length)];
    while (randomKeeper.teamCode === randomTaker.teamCode) {
      randomKeeper = keepers[Math.floor(Math.random() * keepers.length)];
    }
    setTaker(randomTaker);
    setKeeper(randomKeeper);
    setResult(null);
    setShowResult(false);
  }, []);

  const handleTakePenalty = useCallback(() => {
    if (!taker || !keeper || isPlaying) return;

    const sim = simulatePenalty(taker, keeper, pressure);
    setResult(sim);
    setIsPlaying(true);
    setShowResult(false);

    setTimeout(() => {
      setShowResult(true);
    }, 1100);

    setTimeout(() => {
      dotIdRef.current += 1;
      const newDot: PenaltyDot = {
        id: dotIdRef.current,
        outcome: sim.outcome,
        zone: sim.takerZone,
        missType: sim.missType,
      };
      setDots((prev) => [...prev.slice(-(MAX_DOTS - 1)), newDot]);
      setIsPlaying(false);
    }, 1500);
  }, [taker, keeper, pressure, isPlaying]);

  const handleClear = useCallback(() => {
    setDots([]);
    setResult(null);
    setShowResult(false);
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-8 gap-6">
      {/* Title */}
      <div className="text-center">
        <h1
          className="font-heading text-5xl text-gold tracking-wide"
          style={{ WebkitTextStroke: "2.5px #ffd700", paintOrder: "stroke fill" }}
        >
          PENALTY SHOOTOUT PREDICTOR
        </h1>
        <p className="font-heading text-2xl text-foreground/50 mt-1 tracking-widest">
          FIFA WORLD CUP 2026
        </p>
      </div>

      {/* Quote */}
      <FootballerQuote minimized={hasSelection} />

      {/* Matchup Selector */}
      <MatchupSelector
        selectedTaker={taker}
        selectedKeeper={keeper}
        onTakerChange={setTaker}
        onKeeperChange={setKeeper}
        onRandomise={handleRandomise}
      />

      {/* Progressive reveal: everything below appears on selection */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Pressure Toggle */}
            <PressureToggle value={pressure} onChange={setPressure} />

            {/* Goal Visualization */}
            <div className="relative w-full max-w-[600px]">
              <GoalVisualization
                taker={taker}
                keeper={keeper}
                dots={dots}
                showOverlay={true}
              />
              <svg
                viewBox="0 0 540 300"
                className="absolute inset-0 w-full pointer-events-none"
              >
                <PenaltyAnimation result={result} isPlaying={isPlaying} />
              </svg>
            </div>

            {/* Result */}
            <ResultDisplay outcome={result?.outcome ?? null} visible={showResult} />

            {/* Stats */}
            <PlayerStats
              taker={taker}
              keeper={keeper}
              scoreProbability={scoreProbability}
            />

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleTakePenalty}
                disabled={isPlaying}
                className="px-8 py-3 rounded-full bg-purple text-white font-heading text-xl tracking-wider transition-all duration-200 hover:shadow-[0_0_20px_rgba(156,39,176,0.5)] hover:bg-purple-dim disabled:opacity-40 disabled:cursor-not-allowed"
              >
                TAKE PENALTY
              </button>
              <button
                onClick={handleClear}
                className="px-5 py-3 rounded-full bg-white/5 text-foreground/50 font-heading text-xl tracking-wider transition-all duration-200 hover:bg-white/10 hover:text-foreground/70"
              >
                CLEAR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
