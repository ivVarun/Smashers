import { useEffect, useState } from "react";
import { getMatchHistory } from "../services/matchHistoryService";
import { getPlayers } from "../services/playerService";

function MatchHistory({ setPage, user }) {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [matchData, playerData] = await Promise.all([
        getMatchHistory(user.uid),
        getPlayers(user.uid),
      ]);

      setMatches(matchData);
      setPlayers(playerData);
    };

    loadData();
  }, [user]);

  const getPlayerName = (playerId) => {
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : "Unknown";
  };

  return (
    <div className="players-container">
      <h2>📜 Match History</h2>

      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        matches.map((match, index) => (
          <div
            key={match.id}
            className="player-card"
            style={{ marginBottom: "20px" }}
          >
            <h3>🏸 Match #{matches.length - index}</h3>

            <strong>Team A</strong>

            {match.teamA.map((id) => (
              <div key={id}>👤 {getPlayerName(id)}</div>
            ))}

            <br />

            <strong>
              {match.teamAScore} - {match.teamBScore}
            </strong>

            <br />
            <br />

            <strong>Team B</strong>

            {match.teamB.map((id) => (
              <div key={id}>👤 {getPlayerName(id)}</div>
            ))}

            <br />

            <strong>
              🏆 Winner: Team {match.winner}
            </strong>

            <br />

            {match.createdAt && (
              <small>
                {match.createdAt
                  .toDate()
                  .toLocaleString()}
              </small>
            )}
          </div>
        ))
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

export default MatchHistory;