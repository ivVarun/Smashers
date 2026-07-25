import { useEffect, useMemo, useState } from "react";
import "./Players.css";
import { getMatchHistory } from "../services/matchHistoryService";
import { getPlayers } from "../services/playerService";

function PlayerProfile({
  setPage,
  selectedPlayer,
  user,
}) {
  const [recentMatches, setRecentMatches] = useState([]);
  const [playerLookup, setPlayerLookup] = useState({});
  const [allMatches, setAllMatches] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !selectedPlayer) return;

      const players = await getPlayers(user.uid);

      const lookup = {};

      players.forEach((player) => {
        lookup[player.id] = player.name;
      });

      setPlayerLookup(lookup);

      const matches = await getMatchHistory(user.uid);

      const playerMatches = matches.filter((match) => {
        const allPlayers = [
          ...(match.teamA || []),
          ...(match.teamB || []),
        ];

        return allPlayers.some((player) => {
          if (typeof player === "string") {
            return player === selectedPlayer.id;
          }

          return player.id === selectedPlayer.id;
        });
      });

      setAllMatches(playerMatches);
      setRecentMatches(playerMatches.slice(0, 5));
    };

    loadData();
  }, [user, selectedPlayer]);

  if (!selectedPlayer) {
    return (
      <div className="players-container">
        <div className="empty-card">
          <h2>No Player Selected</h2>
          <p>Please select a player from Rankings.</p>
        </div>

        <button
          className="back-button"
          onClick={() => setPage("rankings")}
        >
          ⬅ Back to Rankings
        </button>
      </div>
    );
  }

  const winPercentage =
    selectedPlayer.matches > 0
      ? Math.round(
          (selectedPlayer.wins / selectedPlayer.matches) * 100
        )
      : 0;

  const playerInTeam = (team) => {
    return team.some((player) => {
      if (typeof player === "string") {
        return player === selectedPlayer.id;
      }

      return player.id === selectedPlayer.id;
    });
  };

  const teamNames = (team) => {
    return team
      .map((player) => {
        if (typeof player === "string") {
          return playerLookup[player] || "Unknown Player";
        }

        return player.name;
      })
      .join(" & ");
  };

  const stats = useMemo(() => {
    let partnerWins = {};
    let partnerGames = {};

    let opponentWins = {};
    let opponentGames = {};

    let longestWin = 0;
    let longestLoss = 0;

    let currentWin = 0;
    let currentLoss = 0;

    let biggestWin = null;
    let biggestLoss = null;

    allMatches.forEach((match) => {
      const inA = playerInTeam(match.teamA);
      const won =
        (match.winner === "A" && inA) ||
        (match.winner === "B" && !inA);

      const myTeam = inA ? match.teamA : match.teamB;
      const oppTeam = inA ? match.teamB : match.teamA;

      myTeam.forEach((p) => {
        const id = typeof p === "string" ? p : p.id;
        if (id === selectedPlayer.id) return;

        partnerGames[id] = (partnerGames[id] || 0) + 1;

        if (won) {
          partnerWins[id] = (partnerWins[id] || 0) + 1;
        }
      });

      oppTeam.forEach((p) => {
        const id = typeof p === "string" ? p : p.id;

        opponentGames[id] = (opponentGames[id] || 0) + 1;

        if (won) {
          opponentWins[id] = (opponentWins[id] || 0) + 1;
        }
      });

      if (won) {
        currentWin++;
        currentLoss = 0;
        longestWin = Math.max(longestWin, currentWin);

        const diff =
          Math.abs(match.teamAScore - match.teamBScore);

        if (
          !biggestWin ||
          diff > biggestWin.diff
        ) {
          biggestWin = {
            diff,
            score: `${match.teamAScore} - ${match.teamBScore}`,
          };
        }
      } else {
        currentLoss++;
        currentWin = 0;
        longestLoss = Math.max(longestLoss, currentLoss);

        const diff =
          Math.abs(match.teamAScore - match.teamBScore);

        if (
          !biggestLoss ||
          diff > biggestLoss.diff
        ) {
          biggestLoss = {
            diff,
            score: `${match.teamAScore} - ${match.teamBScore}`,
          };
        }
      }
    });

    const bestPartnerId = Object.keys(partnerWins).sort(
      (a, b) => partnerWins[b] - partnerWins[a]
    )[0];

    const toughestOpponentId = Object.keys(
      opponentWins
    ).sort(
      (a, b) => opponentWins[b] - opponentWins[a]
    )[0];

    return {
      bestPartner:
        bestPartnerId &&
        `${playerLookup[bestPartnerId] || "Unknown"} (${
          partnerWins[bestPartnerId]
        } wins)`,

      toughestOpponent:
        toughestOpponentId &&
        `${playerLookup[toughestOpponentId] || "Unknown"} (${
          opponentWins[toughestOpponentId]
        } wins)`,

      longestWin,
      longestLoss,
      biggestWin,
      biggestLoss,
    };
  }, [allMatches, playerLookup, selectedPlayer]);

  return (
    <div className="players-container">
      <div className="page-header">
        <div
          className="player-avatar"
          style={{
            width: "90px",
            height: "90px",
            fontSize: "36px",
            margin: "0 auto 20px",
          }}
        >
          {selectedPlayer.name.charAt(0).toUpperCase()}
        </div>

        <h1>{selectedPlayer.name}</h1>

        <p>Player Profile</p>
      </div>

      <div className="player-form-card">
        <div className="section-title">
          <h2>⭐ Rating</h2>
          <span>{selectedPlayer.elo}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          <div>
            <strong>🏸 Matches</strong>
            <p>{selectedPlayer.matches}</p>
          </div>

          <div>
            <strong>🏆 Wins</strong>
            <p>{selectedPlayer.wins}</p>
          </div>

          <div>
            <strong>❌ Losses</strong>
            <p>{selectedPlayer.losses}</p>
          </div>

          <div>
            <strong>🎯 Win %</strong>
            <p>{winPercentage}%</p>
          </div>
        </div>
      </div>

      <div className="player-form-card">
        <h2>📊 Career Highlights</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <div>
            <strong>🤝 Best Partner</strong>
            <p>{stats.bestPartner || "-"}</p>
          </div>

          <div>
            <strong>🔥 Toughest Opponent</strong>
            <p>{stats.toughestOpponent || "-"}</p>
          </div>

          <div>
            <strong>🏆 Longest Win Streak</strong>
            <p>{stats.longestWin}</p>
          </div>

          <div>
            <strong>💔 Longest Losing Streak</strong>
            <p>{stats.longestLoss}</p>
          </div>

          <div>
            <strong>💥 Biggest Win</strong>
            <p>{stats.biggestWin?.score || "-"}</p>
          </div>

          <div>
            <strong>😬 Biggest Loss</strong>
            <p>{stats.biggestLoss?.score || "-"}</p>
          </div>
        </div>
      </div>

      <div className="player-form-card">
        <h2>📜 Recent Matches</h2>

        {recentMatches.length === 0 ? (
          <p
            style={{
              color: "#cbd5e1",
              marginTop: "15px",
            }}
          >
            No matches found.
          </p>
        ) : (
          recentMatches.map((match) => {
            const won =
              (match.winner === "A" &&
                playerInTeam(match.teamA)) ||
              (match.winner === "B" &&
                playerInTeam(match.teamB));

            return (
              <div
                key={match.id}
                style={{
                  background: "#0f172a",
                  borderRadius: "12px",
                  padding: "18px",
                  marginTop: "15px",
                }}
              >
                <h3
                  style={{
                    color: won ? "#22c55e" : "#ef4444",
                    marginBottom: "12px",
                  }}
                >
                  {won ? "✅ Win" : "❌ Loss"}
                </h3>

                <p>
                  <strong>
                    {match.teamAScore} : {match.teamBScore}
                  </strong>
                </p>

                <p style={{ marginTop: "8px" }}>
                  {teamNames(match.teamA)}
                </p>

                <p
                  style={{
                    color: "#94a3b8",
                    margin: "6px 0",
                  }}
                >
                  vs
                </p>

                <p>{teamNames(match.teamB)}</p>
              </div>
            );
          })
        )}
      </div>

      <button
        className="back-button"
        onClick={() => setPage("rankings")}
      >
        ⬅ Back to Rankings
      </button>
    </div>
  );
}

export default PlayerProfile;