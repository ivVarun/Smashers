import { useEffect, useState } from "react";
import { getPlayers } from "../services/playerService";

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
      <h2>🏸 New Match</h2>

      <h3>Select 4 Players</h3>

      <p>
        Selected: {currentMatch.selectedPlayers.length} / 4
      </p>

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
                  ? "2px solid limegreen"
                  : "2px solid transparent",
              }}
            >
              {selected ? "✅ " : "⬜ "}
              {player.name}
            </div>
          );
        })}
      </div>

      <br />

      <button
        disabled={currentMatch.selectedPlayers.length !== 4}
        onClick={() => setPage("teamSelection")}
      >
        ➡️ Next
      </button>

      <br />
      <br />

      <button
        className="back-button"
        onClick={() => setPage("dashboard")}
      >
        ⬅ Back
      </button>
    </div>
  );
}

export default NewMatch;