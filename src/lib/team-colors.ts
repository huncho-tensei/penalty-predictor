const TEAM_COLORS: Record<string, string> = {
  MEX: "#006847", RSA: "#007749", KOR: "#cd2e3a", CZE: "#d7141a",
  CAN: "#ff0000", BIH: "#002395", QAT: "#8a1538", SUI: "#ff0000",
  BRA: "#009739", MAR: "#c1272d", HAI: "#00209f", SCO: "#003078",
  USA: "#002868", PAR: "#d52b1e", AUS: "#00843d", TUR: "#e30a17",
  GER: "#000000", CUW: "#002b7f", CIV: "#f77f00", ECU: "#ffd100",
  NED: "#ff6600", JPN: "#bc002d", SWE: "#006aa7", TUN: "#e70013",
  BEL: "#ed2939", EGY: "#c8102e", IRN: "#239f40", NZL: "#000000",
  ESP: "#aa151b", CPV: "#003893", KSA: "#006c35", URU: "#5cbfeb",
  FRA: "#002395", SEN: "#00853f", IRQ: "#ce1126", NOR: "#ef2b2d",
  ARG: "#75aadb", ALG: "#006233", AUT: "#ed2939", JOR: "#007a33",
  POR: "#006600", COD: "#007fff", UZB: "#1eb53a", COL: "#fcd116",
  ENG: "#ffffff", CRO: "#ff0000", GHA: "#006b3f", PAN: "#da121a",
};

export function getTeamColor(code: string): string {
  return TEAM_COLORS[code] ?? "rgba(255, 255, 255, 0.15)";
}
