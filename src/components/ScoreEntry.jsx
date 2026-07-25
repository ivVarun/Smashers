import { useState } from "react";
import "./Players.css";
import { saveMatch } from "../services/matchService";
import { updatePlayerStats } from "../services/playerStatsService";

function ScoreEntry({
  setPage,
  currentMatch,
  setCurrentMatch,
  user,
}) {
  const [teamAScore, setTeamAScore] = useState(
    currentMatch.teamAScore
  );

  const [teamBScore, setTeamBScore] = useState(
    currentMatch.teamBScore
  );

  const [saving, setSaving] = useState(false);

  const handleSaveMatch = async () => {
    try {
      setSaving(true);

      const updatedMatch = {
        ...currentMatch,
        teamAScore: Number(teamAScore),
        teamBScore: Number(teamBScore),
      };

      setCurrentMatch(updatedMatch);

      await saveMatch(user.uid, updatedMatch);
      await updatePlayerStats(updatedMatch);

      alert("✅ Match saved successfully!");

      setCurrentMatch({
        selectedPlayers: [],
        teamA: [],
        teamB: [],
        teamAScore: "",
        teamBScore: "",
      });

      setPage("dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save match.");
    } finally {
      setSaving(false);
    }
  };

  const validScores =
    teamAScore !== "" &&
    teamBScore !== "" &&
    Number(teamAScore) !== Number(teamBScore);

  return (
    <div className="players-container">
      <div className="page-header">
        <h1>🏸 Score Entry</h1>
        <p>Enter the final score for both teams.</p>
      </div>

      <div className="player-form-card">
        <div className="section-title">
          <h2>🏸 Team A</h2>
          <span>{currentMatch.teamA.length} Players</span>
        </div>

        {currentMatch.teamA.map((player) => (
          <div
            key={player.id}
            style={{
              color: "white",
              padding: "6px 0",
            }}
          >
            👤 {player.name}
          </div>
        ))}

        <input
          type="number"
          className="player-input"
          placeholder="Team A Score"
          value={teamAScore}
          onChange={(e) => setTeamAScore(e.target.value)}
        />

        <h1
          style={{
            textAlign: "center",
            margin: "25px 0",
            color: "#3b82f6",
          }}
        >
          VS
        </h1>

        <div className="section-title">
          <h2>🏸 Team B</h2>
          <span>{currentMatch.teamB.length} Players</span>
        </div>

        {currentMatch.teamB.map((player) => (
          <div
            key={player.id}
            style={{
              color: "white",
              padding: "6px 0",
            }}
          >
            👤 {player.name}
          </div>
        ))}

        <input
          type="number"
          className="player-input"
          placeholder="Team B Score"
          value={teamBScore}
          onChange={(e) => setTeamBScore(e.target.value)}
        />
      </div>

      <button
        className="add-button"
        disabled={!validScores || saving}
        onClick={handleSaveMatch}
      >
        {saving ? "Saving Match..." : "💾 Save Match"}
      </button>

      <button
        className="back-button"
        onClick={() => setPage("teamSelection")}
      >
        ⬅ Back
      </button>
    </div>
  );
}

export default ScoreEntry;