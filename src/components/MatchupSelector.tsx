"use client";

import { useState, useMemo, useEffect } from "react";
import type { Player, Team } from "@/lib/types";
import teams from "@/data/teams.json";
import players from "@/data/players.json";

type MatchupSelectorProps = {
  selectedTaker: Player | null;
  selectedKeeper: Player | null;
  onTakerChange: (player: Player | null) => void;
  onKeeperChange: (player: Player | null) => void;
  onRandomise: () => void;
};

const typedTeams = teams as Team[];
const typedPlayers = players as Player[];

const confederationOrder = ["UEFA", "CONMEBOL", "CONCACAF", "AFC", "CAF", "OFC"];

function groupTeamsByConfederation(teamList: Team[]) {
  const grouped: Record<string, Team[]> = {};
  for (const conf of confederationOrder) {
    grouped[conf] = teamList
      .filter((t) => t.confederation === conf)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}

const grouped = groupTeamsByConfederation(typedTeams);

function PlayerDropdown({
  label,
  role,
  selectedPlayer,
  onPlayerChange,
}: {
  label: string;
  role: "taker" | "keeper";
  selectedPlayer: Player | null;
  onPlayerChange: (player: Player | null) => void;
}) {
  const [teamCode, setTeamCode] = useState(selectedPlayer?.teamCode ?? "");

  useEffect(() => {
    if (selectedPlayer) {
      setTeamCode(selectedPlayer.teamCode);
    }
  }, [selectedPlayer]);

  const availablePlayers = useMemo(
    () => typedPlayers.filter((p) => p.teamCode === teamCode && p.role === role),
    [teamCode, role]
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-heading text-lg tracking-widest text-foreground/40 uppercase">
        {label}
      </span>
      <div className="flex gap-2">
        <select
          value={teamCode}
          onChange={(e) => {
            setTeamCode(e.target.value);
            onPlayerChange(null);
          }}
          className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-noto text-foreground focus:outline-none focus:border-purple appearance-none cursor-pointer"
        >
          <option value="">Select team</option>
          {Object.entries(grouped).map(([conf, confTeams]) => (
            <optgroup key={conf} label={conf}>
              {confTeams.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.flag} {t.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select
          value={selectedPlayer?.id ?? ""}
          onChange={(e) => {
            const player =
              typedPlayers.find((p) => p.id === e.target.value) ?? null;
            onPlayerChange(player);
          }}
          disabled={!teamCode}
          className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-noto text-foreground focus:outline-none focus:border-purple appearance-none cursor-pointer disabled:opacity-30"
        >
          <option value="">Select player</option>
          {availablePlayers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function MatchupSelector({
  selectedTaker,
  selectedKeeper,
  onTakerChange,
  onKeeperChange,
  onRandomise,
}: MatchupSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <PlayerDropdown
        label="Penalty Taker"
        role="taker"
        selectedPlayer={selectedTaker}
        onPlayerChange={onTakerChange}
      />

      <button
        onClick={onRandomise}
        className="px-6 py-2 rounded-full bg-purple/20 text-purple hover:bg-purple/30 font-heading text-base tracking-wider transition-all duration-200 hover:shadow-[0_0_12px_rgba(156,39,176,0.3)]"
      >
        RANDOMISE MATCHUP
      </button>

      <PlayerDropdown
        label="Goalkeeper"
        role="keeper"
        selectedPlayer={selectedKeeper}
        onPlayerChange={onKeeperChange}
      />
    </div>
  );
}
