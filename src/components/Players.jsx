import { useEffect, useState } from "react";
import "./Players.css";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

function Players({ setPage }) {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);

  const playersCollection = collection(db, "players");

  const loadPlayers = async () => {
    const data = await getDocs(playersCollection);

    const loadedPlayers = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPlayers(loadedPlayers);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const addPlayer = async () => {
    if (playerName.trim() === "") return;

    await addDoc(playersCollection, {
      name: playerName.trim(),
      wins: 0,
      losses: 0,
      matches: 0,
      elo: 1000,
      createdAt: new Date(),
    });

    setPlayerName("");

    loadPlayers();
  };

  const deletePlayer = async (id) => {
    await deleteDoc(doc(db, "players", id));

    loadPlayers();
  };

  return (
    <div className="players-container">
      <h2>👤 Players</h2>

      <input
        className="player-input"
        type="text"
        placeholder="Enter player name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <button className="add-button" onClick={addPlayer}>
        ➕ Add Player
      </button>

      {players.length === 0 ? (
        <p>No players added yet.</p>
      ) : (
        <div className="players-list">
          <h3>Players</h3>

          {players.map((player) => (
            <div key={player.id} className="player-card">
              <span>{player.name}</span>

              <div className="player-actions">
                <button>✏️</button>

                <button onClick={() => deletePlayer(player.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="back-button"
        onClick={() => setPage("dashboard")}
      >
        ⬅ Back
      </button>
    </div>
  );
}

export default Players;