import { useEffect, useState } from "react";
import "./Players.css";
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
      <div className="page-header">
        <h1>📜 Match History</h1>
        <p>Your previously played badminton matches.</p>
      </div>

      {matches.length === 0 ? (
        <div className="empty-card">
          <h3>No Matches Yet</h3>
          <p>Play your first match to see it here.</p>
        </div>
      ) : (
        <div className="players-list">
          {matches.map((match, index) => (
            <div
              key={match.id}
              className="player-form-card"
            >
              <div className="section-title">
                <h2>🏸 Match #{matches.length - index}</h2>

                <span>
                  {match.createdAt
                    ? match.createdAt.toDate().toLocaleDateString()
                    : ""}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "30px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3>🔵 Team A</h3>

                  {match.teamA.map((id) => (
                    <div
                      key={id}
                      style={{
                        padding: "5px 0",
                        color: "white",
                      }}
                    >
                      👤 {getPlayerName(id)}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    textAlign: "center",
                    minWidth: "120px",
                    alignSelf: "center",
                  }}
                >
                  <h1
                    style={{
                      color: "#3b82f6",
                      margin: 0,
                    }}
                  >
                    {match.teamAScore} : {match.teamBScore}
                  </h1>

                  <p
                    style={{
                      color: "#94a3b8",
                      marginTop: "10px",
                    }}
                  >
                    🏆 Team {match.winner} Won
                  </p>
                </div>

                <div style={{ flex: 1 }}>
                  <h3>🟣 Team B</h3>

                  {match.teamB.map((id) => (
                    <div
                      key={id}
                      style={{
                        padding: "5px 0",
                        color: "white",
                      }}
                    >
                      👤 {getPlayerName(id)}
                    </div>
                  ))}
                </div>
              </div>

              {match.createdAt && (
                <div
                  style={{
                    marginTop: "20px",
                    color: "#94a3b8",
                    fontSize: "14px",
                    textAlign: "right",
                  }}
                >
                  {match.createdAt.toDate().toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        className="back-button"
        onClick={() => setPage("dashboard")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default MatchHistory;