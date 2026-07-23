import "./App.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

function App() {

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Welcome " + result.user.displayName);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
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

      <h2>Morning Badminton Club</h2>

      <p>6:00 AM - 7:30 AM</p>

      <button
        onClick={login}
        style={{
          padding: "15px 30px",
          borderRadius: "10px",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default App;