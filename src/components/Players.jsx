import { useEffect, useMemo, useState } from "react";
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
  const [searchText, setSearchText] = useState("");

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

    cancelEditing();
    await loadPlayers();
  };

  const startEditing = (player) => {
    setPlayerName(player.name);
    setEditingPlayerId(player.id);
  };

  const cancelEditing = () => {
    setEditingPlayerId(null);
    setPlayerName("");
  };

  const removePlayer = async (player) => {
    const confirmed = window.confirm(
      `Delete "${player.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    await deletePlayer(player.id);

    if (editingPlayerId === player.id) {
      cancelEditing();
    }

    await loadPlayers();
  };

  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [players, searchText]);

  return (
    <div className="players-container">

      <div className="page-header">
        <h1>👥 Players</h1>
        <p>Manage your badminton club players.</p>
      </div>

      <div className="summary-card">
        <div className="summary-item">
          <span>Total Players</span>
          <h2>{players.length}</h2>
        </div>

        <div className="summary-item">
          <span>Ready To Play</span>
          <h2>{players.length}</h2>
        </div>
      </div>

      <div className="player-form-card">

        {editingPlayerId && (
          <div className="editing-banner">
            <span>✏️ Editing Player</span>

            <button
              className="cancel-edit-btn"
              onClick={cancelEditing}
            >
              Cancel
            </button>
          </div>
        )}

        <input
          className="player-input"
          type="text"
          placeholder="Enter player name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") savePlayer();
          }}
        />

        <button
          className="add-button"
          onClick={savePlayer}
        >
          {editingPlayerId ? "💾 Update Player" : "➕ Add Player"}
        </button>

      </div>

      <div className="search-card">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search players..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="players-section">

        <div className="section-title">
          <h2>Players</h2>

          <span>
            {filteredPlayers.length} Player
            {filteredPlayers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="empty-card">
            <h3>No Players Found</h3>

            <p>
              {players.length === 0
                ? "Add your first player to begin."
                : "No player matches your search."}
            </p>
          </div>
        ) : (
          <div className="players-list">

            {filteredPlayers.map((player) => (

              <div
                key={player.id}
                className="player-card"
              >

                <div className="player-top">

                  <div className="player-avatar">
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="player-details">
                    <h3>{player.name}</h3>

                    <span>🏸 Ready to Play</span>
                  </div>

                </div>

                <div className="player-stats">

                  <div>
                    <small>Matches</small>
                    <strong>0</strong>
                  </div>

                  <div>
                    <small>Wins</small>
                    <strong>0</strong>
                  </div>

                  <div>
                    <small>Losses</small>
                    <strong>0</strong>
                  </div>

                </div>

                <div className="player-actions">

                  <button
                    className="edit-button"
                    onClick={() => startEditing(player)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => removePlayer(player)}
                  >
                    🗑 Delete
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