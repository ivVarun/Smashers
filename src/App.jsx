import "./App.css";
import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

function App() {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

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
        <button onClick={login}>Sign in with Google</button>
      ) : (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <p>{user.email}</p>

          <button onClick={logout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;