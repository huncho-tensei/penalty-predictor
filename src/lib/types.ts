export type ZoneDistribution = {
  topLeft: number;
  topCenter: number;
  topRight: number;
  bottomLeft: number;
  bottomCenter: number;
  bottomRight: number;
};

export type Player = {
  id: string;
  name: string;
  team: string;
  teamCode: string;
  role: "taker" | "keeper";
  foot: "left" | "right";
  penaltiesTaken?: number;
  penaltiesFaced?: number;
  conversionRate?: number;
  saveRate?: number;
  zones: ZoneDistribution;
  source: "verified" | "derived";
};

export type Team = {
  name: string;
  code: string;
  flag: string;
  confederation: "AFC" | "CAF" | "CONCACAF" | "CONMEBOL" | "OFC" | "UEFA";
  group: string;
};

export type PressureMode = "regular" | "early" | "decisive";

export type PenaltyOutcome = "goal" | "saved" | "miss";

export type MissType = "left-post" | "right-post" | "crossbar" | "over";

export type SimulationResult = {
  outcome: PenaltyOutcome;
  takerZone: keyof ZoneDistribution;
  keeperZone: keyof ZoneDistribution;
  missType?: MissType;
};

export type PenaltyDot = {
  id: number;
  outcome: PenaltyOutcome;
  zone: keyof ZoneDistribution;
  missType?: MissType;
};
