import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

export async function getMatchHistory(userId) {
  const matchesRef = collection(db, "matches");

  const q = query(
    matchesRef,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const matches = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Sort newest first
  matches.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;

    return timeB - timeA;
  });

  return matches;
}