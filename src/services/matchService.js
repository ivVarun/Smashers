import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export const saveMatch = async (userId, currentMatch) => {
  const winner =
    Number(currentMatch.teamAScore) >
    Number(currentMatch.teamBScore)
      ? "A"
      : "B";

  const match = {
    userId,

    // Store both ID and Name
    teamA: currentMatch.teamA.map((player) => ({
      id: player.id,
      name: player.name,
    })),

    teamB: currentMatch.teamB.map((player) => ({
      id: player.id,
      name: player.name,
    })),

    teamAScore: Number(currentMatch.teamAScore),

    teamBScore: Number(currentMatch.teamBScore),

    winner,

    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, "matches"),
    match
  );

  return docRef.id;
};