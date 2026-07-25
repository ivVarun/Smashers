import { useEffect, useState } from "react";
import { getPlayers } from "../services/playerService";
import "./Players.css";

function NewMatch({
  setPage,
  user,
  currentMatch,
  setCurrentMatch,
}) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      if (!user) return;

      const data = await getPlayers(user.uid);
      setPlayers(data);
    };

    loadPlayers();
  }, [user]);

  const togglePlayer = (player) => {
    const alreadySelected = currentMatch.selectedPlayers.some(
      (p) => p.id === player.id
    );

    if (alreadySelected) {
      setCurrentMatch({
        ...currentMatch,
        selectedPlayers: currentMatch.selectedPlayers.filter(
          (p) => p.id !== player.id
        ),
      });
      return;
    }

    if (currentMatch.selectedPlayers.length >= 4) {
      return;
    }

    setCurrentMatch({
      ...currentMatch,
      selectedPlayers: [
        ...currentMatch.selectedPlayers,
        player,
      ],
    });
  };

  return (
    <div className="players-container">
      <div className="page-header">
        <h1>🏸 New Match</h1>
        <p>Select four players to begin.</p>
      </div>

      <div className="section-title">
        <h2>Players</h2>

        <span>
          {currentMatch.selectedPlayers.length} / 4 Selected
        </span>
      </div>

      <div className="players-list">
        {players.map((player) => {
          const selected = currentMatch.selectedPlayers.some(
            (p) => p.id === player.id
          );

          return (
            <div
              key={player.id}
              className="player-card"
              onClick={() => togglePlayer(player)}
              style={{
                cursor: "pointer",
                border: selected
                  ? "2px solid #22c55e"
                  : "2px solid transparent",
              }}
            >
              <div className="player-info">
                <div className="player-avatar">
                  {player.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>{player.name}</h3>
                  <p>
                    {selected
                      ? "Selected"
                      : "Tap to select"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  fontSize: "28px",
                }}
              >
                {selected ? "✅" : "⬜"}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="add-button"
        disabled={currentMatch.selectedPlayers.length !== 4}
        onClick={() => setPage("teamSelection")}
      >
        ➜ Continue
      </button>

      <button
        className="back-button"
        onClick={() => setPage("dashboard")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default NewMatch;