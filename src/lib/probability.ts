import type { Player, PressureMode, ZoneDistribution } from "./types";
import baselines from "../data/research-baselines.json";

const ZONE_SAVE_DIFFICULTY: ZoneDistribution = {
  topLeft: baselines.zoneSaveDifficulty.topLeft,
  topCenter: baselines.zoneSaveDifficulty.topCenter,
  topRight: baselines.zoneSaveDifficulty.topRight,
  bottomLeft: baselines.zoneSaveDifficulty.bottomLeft,
  bottomCenter: baselines.zoneSaveDifficulty.bottomCenter,
  bottomRight: baselines.zoneSaveDifficulty.bottomRight,
};

const PRESSURE = baselines.pressureModes;
const AVG_SAVE_RATE = baselines.averageKeeperSaveRate;
const AVG_MISS_RATE = baselines.averageMissRate;
const MAX_SAVE_CHANCE = 0.95;

export function getKeeperMultiplier(keeper: Player): number {
  const saveRate = keeper.saveRate ?? AVG_SAVE_RATE;
  return saveRate / AVG_SAVE_RATE;
}

export function getEffectiveSaveChance(
  zone: keyof ZoneDistribution,
  keeper: Player,
  pressure: PressureMode
): number {
  const base = ZONE_SAVE_DIFFICULTY[zone];
  const keeperMult = getKeeperMultiplier(keeper);
  const pressureMod = PRESSURE[pressure].keeperModifier;
  return Math.min(base * (keeperMult + pressureMod), MAX_SAVE_CHANCE);
}

export function getMissRate(taker: Player, pressure: PressureMode): number {
  const baseConversion = taker.conversionRate ?? (1 - AVG_MISS_RATE);
  const baseMiss = Math.max(0, 1 - baseConversion - 0.08);
  const pressureMod = PRESSURE[pressure].missRateModifier;
  return Math.min(baseMiss + pressureMod, 0.40);
}

export function calculateScoreProbability(
  taker: Player,
  keeper: Player,
  pressure: PressureMode
): number {
  const missRate = getMissRate(taker, pressure);
  const zones = Object.keys(taker.zones) as (keyof ZoneDistribution)[];

  let onTargetScoreProb = 0;

  for (const zone of zones) {
    const takerProb = taker.zones[zone];
    const keeperProb = keeper.zones[zone];
    const saveCh = getEffectiveSaveChance(zone, keeper, pressure);

    const scoreIfKeeperElsewhere = takerProb * (1 - keeperProb);
    const scoreIfKeeperSameZone = takerProb * keeperProb * (1 - saveCh);

    onTargetScoreProb += scoreIfKeeperElsewhere + scoreIfKeeperSameZone;
  }

  return (1 - missRate) * onTargetScoreProb;
}
