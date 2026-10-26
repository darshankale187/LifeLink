import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="login-wrap">
      <div className="login-card center">
        <h1>404</h1>
        <p className="muted">This page does not exist.</p>
        <Link className="btn" to="/">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}