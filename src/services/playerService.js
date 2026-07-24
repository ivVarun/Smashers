import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

const playersCollection = collection(db, "players");

export async function getPlayers(userId) {
  const q = query(
    playersCollection,
    where("ownerId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addPlayer(userId, name) {
  await addDoc(playersCollection, {
    name,
    ownerId: userId,
    wins: 0,
    losses: 0,
    matches: 0,
    elo: 1000,
    createdAt: new Date(),
  });
}

export async function updatePlayer(playerId, name) {
  await updateDoc(doc(db, "players", playerId), {
    name,
  });
}

export async function deletePlayer(playerId) {
  await deleteDoc(doc(db, "players", playerId));
}