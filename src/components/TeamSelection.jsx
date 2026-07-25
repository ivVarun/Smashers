import { useState, useEffect } from "react";
import "./Players.css";

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
      <div className="page-header">
        <h1>👥 Team Selection</h1>
        <p>Select two players for Team A.</p>
      </div>

      <div className="section-title">
        <h2>Selected Players</h2>
        <span>{teamA.length} / 2 Selected</span>
      </div>

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
                      ? "Team A"
                      : "Tap to add"}
                  </p>
                </div>
              </div>

              <div style={{ fontSize: "28px" }}>
                {selected ? "✅" : "⬜"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="player-form-card" style={{ marginTop: "30px" }}>
        <div className="section-title">
          <h2>🏸 Team A</h2>
          <span>{currentMatch.teamA.length} Players</span>
        </div>

        {currentMatch.teamA.length === 0 ? (
          <p>No players selected.</p>
        ) : (
          currentMatch.teamA.map((player) => (
            <div
              key={player.id}
              style={{ padding: "8px 0", color: "white" }}
            >
              👤 {player.name}
            </div>
          ))
        )}

        <hr
          style={{
            margin: "20px 0",
            borderColor: "#334155",
          }}
        />

        <div className="section-title">
          <h2>🏸 Team B</h2>
          <span>{currentMatch.teamB.length} Players</span>
        </div>

        {currentMatch.teamB.length === 0 ? (
          <p>No players assigned yet.</p>
        ) : (
          currentMatch.teamB.map((player) => (
            <div
              key={player.id}
              style={{ padding: "8px 0", color: "white" }}
            >
              👤 {player.name}
            </div>
          ))
        )}
      </div>

      <button
        className="add-button"
        disabled={teamA.length !== 2}
        onClick={() => setPage("scoreEntry")}
      >
        ➜ Continue to Score Entry
      </button>

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