import "./App.css";
import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, provider } from "./firebase";
import Players from "./components/Players";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setPage("dashboard");
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "Arial",
      }}
    >
      <h1>🏸 Smashers</h1>

      {!user ? (
        <button
          onClick={login}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <h2>Welcome, {user.displayName}</h2>

          {page === "dashboard" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                marginTop: "30px",
                width: "250px",
              }}
            >
              <button
                onClick={() => setPage("players")}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                👤 Players
              </button>

              <button
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🏸 New Match
              </button>

              <button
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                📊 Rankings
              </button>

              <button
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                📈 Statistics
              </button>

              <button
                onClick={logout}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}

          {page === "players" && (
            <Players
              setPage={setPage}
              user={user}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;