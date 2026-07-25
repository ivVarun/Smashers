import { useEffect, useMemo, useState } from "react";
import "./Players.css";
import { getPlayers } from "../services/playerService";

function Rankings({ setPage, user, setSelectedPlayer }) {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [players, search]);

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

  const getWinColor = (percentage) => {
    if (percentage >= 70) return "#22c55e";
    if (percentage >= 55) return "#f59e0b";
    return "#ef4444";
  };

  const openProfile = (player) => {
    setSelectedPlayer(player);
    setPage("playerProfile");
  };

  return (
    <div className="players-container">
      <div className="page-header">
        <h1>🏆 Rankings</h1>
        <p>Current Smashers Leaderboard</p>
      </div>

      <div
        className="player-form-card"
        style={{ marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="🔍 Search player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
            fontSize: "15px",
            outline: "none",
          }}
        />
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="empty-card">
          <h3>No Players Found</h3>
          <p>Try another search.</p>
        </div>
      ) : (
        <div className="players-list">
          {filteredPlayers.map((player, index) => {
            const winPercentage = getWinPercentage(player);

            return (
              <div
                key={player.id}
                className="player-form-card"
                onClick={() => openProfile(player)}
                style={{
                  cursor: "pointer",
                  transition: ".25s",
                  border:
                    index === 0
                      ? "2px solid #facc15"
                      : "1px solid #1e293b",
                }}
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
                    gridTemplateColumns:
                      "repeat(2,minmax(120px,1fr))",
                    gap: "18px",
                    marginTop: "20px",
                  }}
                >
                  <div>
                    <strong>🏸 Matches</strong>
                    <p>{player.matches}</p>
                  </div>

                  <div>
                    <strong>🏆 Wins</strong>
                    <p>{player.wins}</p>
                  </div>

                  <div>
                    <strong>❌ Losses</strong>
                    <p>{player.losses}</p>
                  </div>

                  <div>
                    <strong>🎯 Win %</strong>
                    <p
                      style={{
                        color: getWinColor(winPercentage),
                        fontWeight: "bold",
                      }}
                    >
                      {winPercentage}%
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                  }}
                >
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "999px",
                      background: "#1e293b",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${winPercentage}%`,
                        height: "100%",
                        background: getWinColor(winPercentage),
                        transition: ".5s",
                      }}
                    />
                  </div>
                </div>

                {index === 0 && (
                  <div
                    style={{
                      marginTop: "18px",
                      color: "#facc15",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    👑 Current Champion
                  </div>
                )}
              </div>
            );
          })}
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