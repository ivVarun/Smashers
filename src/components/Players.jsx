import { useEffect, useState } from "react";
import "./Players.css";

import {
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
} from "../services/playerService";

function Players({ setPage, user }) {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [editingPlayerId, setEditingPlayerId] = useState(null);

  const loadPlayers = async () => {
    if (!user) return;

    const data = await getPlayers(user.uid);
    setPlayers(data);
  };

  useEffect(() => {
    if (user) {
      loadPlayers();
    }
  }, [user]);

  const savePlayer = async () => {
    if (playerName.trim() === "") return;

    if (editingPlayerId) {
      await updatePlayer(editingPlayerId, playerName.trim());
    } else {
      await addPlayer(user.uid, playerName.trim());
    }

    setPlayerName("");
    setEditingPlayerId(null);

    await loadPlayers();
  };

  const startEditing = (player) => {
    setPlayerName(player.name);
    setEditingPlayerId(player.id);
  };

  const removePlayer = async (playerId) => {
    await deletePlayer(playerId);

    if (editingPlayerId === playerId) {
      setEditingPlayerId(null);
      setPlayerName("");
    }

    await loadPlayers();
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

      <button
        className="add-button"
        onClick={savePlayer}
      >
        {editingPlayerId ? "💾 Update Player" : "➕ Add Player"}
      </button>

      {players.length === 0 ? (
        <p>No players added yet.</p>
      ) : (
        <div className="players-list">
          <h3>Players</h3>

          {players.map((player) => (
            <div
              key={player.id}
              className="player-card"
            >
              <span>{player.name}</span>

              <div className="player-actions">
                <button onClick={() => startEditing(player)}>
                  ✏️
                </button>

                <button onClick={() => removePlayer(player.id)}>
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