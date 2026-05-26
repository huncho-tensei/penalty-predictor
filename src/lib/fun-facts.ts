const PLAYER_FACTS: Record<string, string[]> = {
  "harry-kane": [
    "Scored 20 out of 20 Bundesliga penalties — a league record.",
    "Has converted 35 of his last 36 penalties for club and country.",
    "His slow run-up and keeper-watching technique is nearly impossible to read.",
  ],
  "cristiano-ronaldo": [
    "Has taken 219 career penalties — more than any active player.",
    "Scored 183 of those 219 — an 84% conversion rate across 20+ years.",
    "His international penalty record (69%) is significantly lower than club (86%).",
  ],
  "lionel-messi": [
    "Missed his first ever World Cup penalty vs Iceland in 2018.",
    "Bounced back with a 83% conversion rate in international penalties.",
    "His 145 career penalty attempts span across 4 different leagues.",
  ],
  "kylian-mbappe": [
    "Scored a hat-trick in the 2022 World Cup Final — two from open play, one penalty.",
    "Has taken 54 career penalties with an 81% conversion rate.",
    "Became Real Madrid's designated penalty taker on his first day.",
  ],
  "mohamed-salah": [
    "Egypt's sole penalty taker — no backup has taken one since 2021.",
    "His Premier League penalty conversion is above 85%.",
    "Places almost 40% of his penalties to his natural right side.",
  ],
  "erling-haaland": [
    "Norway's first World Cup appearance since 1998 — Haaland is on penalty duty.",
    "His left foot generates one of the most powerful penalty strikes in football.",
    "Career conversion rate of 87% from the spot.",
  ],
  "bruno-fernandes": [
    "Was Portugal's primary taker over Cristiano Ronaldo in Euro 2024.",
    "One of only three active players with 60+ career penalties taken.",
    "His hop-skip run-up is one of the most recognisable in football.",
  ],
  "cole-palmer": [
    "90% career conversion rate — the highest of any player at this World Cup.",
    "Scored 4 penalties in a single Premier League game vs Brighton.",
    "At 22, he's the youngest elite penalty taker at the tournament.",
  ],
  "hakan-calhanoglu": [
    "89% career conversion — second highest at the tournament behind Palmer.",
    "His technique from 12 yards is considered technically perfect by analysts.",
    "Has never missed a penalty for Inter Milan in Serie A.",
  ],
  "viktor-gyokeres": [
    "Went from Championship football to World Cup penalty taker in 3 years.",
    "88% conversion rate across Portuguese and Swedish leagues.",
    "Sporting CP's all-time single-season goal record holder.",
  ],
  "emiliano-martinez": [
    "Has never lost a penalty shootout with Argentina — won all 4.",
    "Saved 9 of 24 shootout penalties faced — a 37.5% save rate.",
    "His psychological warfare with takers is legendary — FIFA had to warn him.",
  ],
  "alisson": [
    "41% career penalty save rate — the highest of any keeper at this World Cup.",
    "Has saved 13 of 32 penalties faced in regular time.",
    "Won the Champions League with a crucial penalty area save in the final.",
  ],
  "jordan-pickford": [
    "England's shootout hero — saved penalties vs Colombia (2018) and Switzerland (2019).",
    "Famously had a water bottle with penalty notes taped to it in 2018.",
    "25% career save rate from the spot.",
  ],
  "diogo-costa": [
    "Saved 3 consecutive penalties in a single shootout vs Slovenia at Euro 2024.",
    "At 27, he's one of the youngest elite penalty-saving keepers in the world.",
    "27% career save rate — built his reputation in just 2 years.",
  ],
  "dominik-livakovic": [
    "Saved 3 penalties against Japan in the 2022 World Cup Round of 16 shootout.",
    "Croatia's shootout weapon — they've won their last 4 shootouts with him.",
    "26% career save rate with a reputation for reading takers' eyes.",
  ],
  "mike-maignan": [
    "Replaced Hugo Lloris as France's #1 and immediately improved their penalty record.",
    "14 career penalty saves — among the top 10 active keepers.",
    "His explosive lateral dive is considered one of the best in the game.",
  ],
};

export function getPlayerFacts(playerId: string): string[] {
  return PLAYER_FACTS[playerId] ?? [];
}

export function getRandomFact(playerId: string): string | null {
  const facts = PLAYER_FACTS[playerId];
  if (!facts || facts.length === 0) return null;
  return facts[Math.floor(Math.random() * facts.length)];
}
