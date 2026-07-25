import { useEffect, useState } from "react";
import "./Players.css";
import { getPlayers } from "../services/playerService";

function Rankings({ setPage, user }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      if (!user) return;

      const data = await getPlayers(user.uid);

      data.sort((a, b) => {
        if (b.elo !== a.elo) return b.elo - a.elo;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.losses - b.losses;
      });

      setPlayers(data);
    };

    loadPlayers();
  }, [user]);

  const getRankEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getWinPercentage = (player) => {
    if (!player.matches) return 0;

    return Math.round((player.wins / player.matches) * 100);
  };

  return (
    <div className="players-container">
      <div className="page-header">
        <h1>🏆 Rankings</h1>
        <p>Player leaderboard based on current statistics.</p>
      </div>

      {players.length === 0 ? (
        <div className="empty-card">
          <h3>No Players Found</h3>
          <p>Add players to see the rankings.</p>
        </div>
      ) : (
        <div className="players-list">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="player-form-card"
            >
              <div className="section-title">
                <h2>
                  {getRankEmoji(index)} {player.name}
                </h2>

                <span>⭐ {player.elo}</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "15px",
                  marginTop: "20px",
                }}
              >
                <div>
                  <strong>Matches</strong>
                  <p>{player.matches}</p>
                </div>

                <div>
                  <strong>Wins</strong>
                  <p>{player.wins}</p>
                </div>

                <div>
                  <strong>Losses</strong>
                  <p>{player.losses}</p>
                </div>

                <div>
                  <strong>Win %</strong>
                  <p>{getWinPercentage(player)}%</p>
                </div>
              </div>
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

export default Rankings;