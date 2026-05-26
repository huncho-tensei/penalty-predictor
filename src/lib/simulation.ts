import type {
  Player,
  PressureMode,
  ZoneDistribution,
  SimulationResult,
  MissType,
  PenaltyOutcome,
} from "./types";
import { getMissRate, getEffectiveSaveChance } from "./probability";

const MISS_TYPES: MissType[] = ["left-post", "right-post", "crossbar", "over"];
const ZONE_KEYS: (keyof ZoneDistribution)[] = [
  "topLeft",
  "topCenter",
  "topRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

function weightedRandom(distribution: ZoneDistribution): keyof ZoneDistribution {
  const rand = Math.random();
  let cumulative = 0;

  for (const zone of ZONE_KEYS) {
    cumulative += distribution[zone];
    if (rand <= cumulative) return zone;
  }

  return ZONE_KEYS[ZONE_KEYS.length - 1];
}

function randomMissType(): MissType {
  return MISS_TYPES[Math.floor(Math.random() * MISS_TYPES.length)];
}

export function simulatePenalty(
  taker: Player,
  keeper: Player,
  pressure: PressureMode
): SimulationResult {
  const missRate = getMissRate(taker, pressure);

  if (Math.random() < missRate) {
    const intendedZone = weightedRandom(taker.zones);
    return {
      outcome: "miss" as PenaltyOutcome,
      takerZone: intendedZone,
      keeperZone: weightedRandom(keeper.zones),
      missType: randomMissType(),
    };
  }

  const takerZone = weightedRandom(taker.zones);
  const keeperZone = weightedRandom(keeper.zones);

  if (takerZone !== keeperZone) {
    return { outcome: "goal", takerZone, keeperZone };
  }

  const saveChance = getEffectiveSaveChance(takerZone, keeper, pressure);

  if (Math.random() < saveChance) {
    return { outcome: "saved", takerZone, keeperZone };
  }

  return { outcome: "goal", takerZone, keeperZone };
}
