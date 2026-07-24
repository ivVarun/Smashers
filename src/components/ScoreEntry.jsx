import { useState } from "react";
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

      // Save locally
      setCurrentMatch(updatedMatch);

      // Save the match to Firestore
      await saveMatch(user.uid, updatedMatch);

      // Update player statistics
      await updatePlayerStats(updatedMatch);

      alert("✅ Match saved successfully!");

      // Reset current match
      setCurrentMatch({
        selectedPlayers: [],
        teamA: [],
        teamB: [],
        teamAScore: "",
        teamBScore: "",
      });

      // Go back to dashboard
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
      <h2>🏸 Match Score</h2>

      <h3>🏸 Team A</h3>

      {currentMatch.teamA.map((player) => (
        <div key={player.id} className="player-card">
          👤 {player.name}
        </div>
      ))}

      <br />

      <input
        type="number"
        className="player-input"
        placeholder="Team A Score"
        value={teamAScore}
        onChange={(e) => setTeamAScore(e.target.value)}
      />

      <h2 style={{ textAlign: "center" }}>VS</h2>

      <input
        type="number"
        className="player-input"
        placeholder="Team B Score"
        value={teamBScore}
        onChange={(e) => setTeamBScore(e.target.value)}
      />

      <br />

      <h3>🏸 Team B</h3>

      {currentMatch.teamB.map((player) => (
        <div key={player.id} className="player-card">
          👤 {player.name}
        </div>
      ))}

      <br />

      <button
        disabled={!validScores || saving}
        onClick={handleSaveMatch}
      >
        {saving ? "Saving..." : "💾 Save Match"}
      </button>

      <br />
      <br />

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