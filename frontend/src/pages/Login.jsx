import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Login() {
  const { user, login, register } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(username, password);
      else await register(username, password);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setBusy(false);
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1>LifeLink</h1>
        <p className="muted">{mode === "login" ? "Sign in to continue" : "Create your account"}</p>

        {error && <Alert>{error}</Alert>}

        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="btn btn-block" type="submit" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <p className="hint">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setError("");
              setMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? "Create account" : "Login"}
          </a>
        </p>
      </form>
    </div>
  );
}