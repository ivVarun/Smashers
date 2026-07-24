import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, provider } from "./firebase";

import "./styles/app.css";

import Players from "./components/Players";
import NewMatch from "./components/NewMatch";
import TeamSelection from "./components/TeamSelection";
import ScoreEntry from "./components/ScoreEntry";
import MatchHistory from "./components/MatchHistory";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [currentMatch, setCurrentMatch] = useState({
    selectedPlayers: [],
    teamA: [],
    teamB: [],
    teamAScore: "",
    teamBScore: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);

    setPage("dashboard");

    setCurrentMatch({
      selectedPlayers: [],
      teamA: [],
      teamB: [],
      teamAScore: "",
      teamBScore: "",
    });
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return (
      <div className="app">
        <h1 className="app-title">🏸 Smashers</h1>

        <button
          className="primary-button"
          onClick={handleLogin}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (page === "players") {
    return (
      <Players
        setPage={setPage}
        user={user}
      />
    );
  }

  if (page === "newMatch") {
    return (
      <NewMatch
        setPage={setPage}
        user={user}
        currentMatch={currentMatch}
        setCurrentMatch={setCurrentMatch}
      />
    );
  }

  if (page === "teamSelection") {
    return (
      <TeamSelection
        setPage={setPage}
        currentMatch={currentMatch}
        setCurrentMatch={setCurrentMatch}
      />
    );
  }

  if (page === "scoreEntry") {
    return (
      <ScoreEntry
        setPage={setPage}
        user={user}
        currentMatch={currentMatch}
        setCurrentMatch={setCurrentMatch}
      />
    );
  }

  if (page === "matchHistory") {
    return (
      <MatchHistory
        setPage={setPage}
        user={user}
      />
    );
  }

  return (
    <div className="app">
      <h1 className="app-title">
        🏸 Smashers
      </h1>

      <p className="welcome-text">
        Welcome back, {user.displayName} 👋
      </p>

      <div className="dashboard-buttons">

        <button
          className="dashboard-button"
          onClick={() => setPage("players")}
        >
          👥 Players
        </button>

        <button
          className="dashboard-button"
          onClick={() => {
            setCurrentMatch({
              selectedPlayers: [],
              teamA: [],
              teamB: [],
              teamAScore: "",
              teamBScore: "",
            });

            setPage("newMatch");
          }}
        >
          🏸 New Match
        </button>

        <button
          className="dashboard-button"
          onClick={() => setPage("matchHistory")}
        >
          📜 Match History
        </button>

        <button
          className="dashboard-button"
          disabled
        >
          🏆 Rankings
        </button>

        <button
          className="dashboard-button"
          disabled
        >
          📊 Statistics
        </button>

      </div>

      <br />

      <button
        className="secondary-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default App;