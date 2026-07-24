import { useState, useEffect } from "react";

function TeamSelection({
  setPage,
  currentMatch,
  setCurrentMatch,
}) {
  const [teamA, setTeamA] = useState(currentMatch.teamA || []);

  useEffect(() => {
    const teamB = currentMatch.selectedPlayers.filter(
      (player) => !teamA.some((p) => p.id === player.id)
    );

    setCurrentMatch((prev) => ({
      ...prev,
      teamA,
      teamB,
    }));
  }, [teamA]);

  const toggleTeamAPlayer = (player) => {
    const exists = teamA.some((p) => p.id === player.id);

    if (exists) {
      setTeamA(teamA.filter((p) => p.id !== player.id));
      return;
    }

    if (teamA.length >= 2) return;

    setTeamA([...teamA, player]);
  };

  return (
    <div className="players-container">
      <h2>👥 Team Selection</h2>

      <h3>Select 2 Players for Team A</h3>

      <p>Selected: {teamA.length} / 2</p>

      <div className="players-list">
        {currentMatch.selectedPlayers.map((player) => {
          const selected = teamA.some(
            (p) => p.id === player.id
          );

          return (
            <div
              key={player.id}
              className="player-card"
              onClick={() => toggleTeamAPlayer(player)}
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

      <hr />

      <h3>🏸 Team A</h3>

      {currentMatch.teamA.length === 0 ? (
        <p>No players selected.</p>
      ) : (
        currentMatch.teamA.map((player) => (
          <div key={player.id}>👤 {player.name}</div>
        ))
      )}

      <hr />

      <h3>🏸 Team B</h3>

      {currentMatch.teamB.map((player) => (
        <div key={player.id}>👤 {player.name}</div>
      ))}

      <br />

      <button
        disabled={teamA.length !== 2}
        onClick={() => setPage("scoreEntry")}
      >
        ➡️ Next
      </button>

      <br />
      <br />

      <button
        className="back-button"
        onClick={() => setPage("newMatch")}
      >
        ⬅ Back
      </button>
    </div>
  );
}

export default TeamSelection;