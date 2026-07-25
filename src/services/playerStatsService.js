import {
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

const ELO_CHANGE = 16;

export async function updatePlayerStats(currentMatch) {
  const winningTeam =
    currentMatch.teamAScore > currentMatch.teamBScore
      ? currentMatch.teamA
      : currentMatch.teamB;

  const losingTeam =
    currentMatch.teamAScore > currentMatch.teamBScore
      ? currentMatch.teamB
      : currentMatch.teamA;

  // Update winners
  for (const player of winningTeam) {
    await updateDoc(doc(db, "players", player.id), {
      wins: increment(1),
      matches: increment(1),
      elo: increment(ELO_CHANGE),
    });
  }

  // Update losers
  for (const player of losingTeam) {
    await updateDoc(doc(db, "players", player.id), {
      losses: increment(1),
      matches: increment(1),
      elo: increment(-ELO_CHANGE),
    });
  }
}