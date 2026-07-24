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

    teamA: currentMatch.teamA.map((player) => player.id),

    teamB: currentMatch.teamB.map((player) => player.id),

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