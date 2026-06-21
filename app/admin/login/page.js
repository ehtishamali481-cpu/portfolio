"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-term">
        <div className="term-bar">
          <span className="path">/admin/login</span>
          <span className="path">🔒 secure</span>
        </div>
        <div className="login-body">
          <div className="login-line"><span className="p">$</span> authenticate --user</div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>EMAIL</label>
              <input
                type="email"
                placeholder="admin@yourdomain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">✗ {error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Run authentication →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
