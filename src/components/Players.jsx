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
      <div className="page-header">
        <h1>👥 Players</h1>
        <p>Manage your badminton players.</p>
      </div>

      <div className="player-form-card">
        <input
          className="player-input"
          type="text"
          placeholder="Enter player name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") savePlayer();
          }}
        />

        <button className="add-button" onClick={savePlayer}>
          {editingPlayerId ? "💾 Update Player" : "➕ Add Player"}
        </button>
      </div>

      <div className="players-section">
        <div className="section-title">
          <h2>Player List</h2>
          <span>{players.length} Player{players.length !== 1 ? "s" : ""}</span>
        </div>

        {players.length === 0 ? (
          <div className="empty-card">
            <p>No players added yet.</p>
            <small>Add your first player to get started.</small>
          </div>
        ) : (
          <div className="players-list">
            {players.map((player) => (
              <div key={player.id} className="player-card">
                <div className="player-info">
                  <div className="player-avatar">
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{player.name}</h3>
                    <p>Ready to play</p>
                  </div>
                </div>

                <div className="player-actions">
                  <button
                    className="edit-button"
                    onClick={() => startEditing(player)}
                  >
                    ✏️
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => removePlayer(player.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="back-button"
        onClick={() => setPage("dashboard")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default Players;