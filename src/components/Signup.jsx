import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ff7b7b", "#f5a623", "#34D399", "#C0C1FF"][
    strength
  ];

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await signupUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      console.log(err, "error from signup");
      setError("Singup Failed");
    } finally {
      setLoading(false);
    }

    // ── swap this block with your real signup call ─────────────────────────
    // e.g. const res = await fetch("/api/signup", { method:"POST", body: JSON.stringify(form) });
    // if (!res.ok) { setError("Username or email already taken."); setLoading(false); return; }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Sora', sans-serif; }
        html, body, #root { height: 100%; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(40px, -30px) scale(1.08); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-30px, 40px) scale(1.05); }
        }
        @keyframes shimmerIn { from { opacity: 0; } to { opacity: 1; } }

        .auth-page {
          min-height: 100vh;
          background: #0d0d0f;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px 0;
        }
        .auth-page::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }
        .orb { position: absolute; border-radius: 9999px; filter: blur(80px); pointer-events: none; }
        .orb-1 { width: 500px; height: 400px; top: -120px; left: -140px; background: rgba(130,0,246,0.12); animation: orb1 9s ease-in-out infinite; }
        .orb-2 { width: 420px; height: 380px; bottom: -100px; right: -100px; background: rgba(192,193,255,0.1); animation: orb2 12s ease-in-out infinite; }
        .orb-3 { width: 280px; height: 220px; top: 40%; left: 55%; background: rgba(221,183,255,0.07); animation: orb1 14s ease-in-out infinite reverse; }

        .auth-split {
          display: flex;
          width: min(960px, 95vw);
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          position: relative; z-index: 1;
          animation: shimmerIn 0.5s ease both;
          box-shadow: 0 40px 80px rgba(0,0,0,0.4);
        }
        .auth-panel-left {
          width: 44%;
          background: linear-gradient(155deg, #0d1a2e 0%, #0d1520 50%, #0d0d0f 100%);
          padding: 48px 40px;
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
        }
        .auth-panel-left::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .brand { display: flex; align-items: center; gap: 10px; animation: fadeUp 0.5s ease both; }
        .brand-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #0066ff, #C0C1FF);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-icon svg { width: 18px; height: 18px; fill: white; }
        .brand-name { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        .panel-hero { animation: fadeUp 0.6s 0.1s ease both; }
        .panel-tagline { font-size: 28px; font-weight: 700; color: #fff; line-height: 1.25; letter-spacing: -0.6px; margin-bottom: 12px; }
        .panel-tagline span { background: linear-gradient(90deg, #60a5fa, #C0C1FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .panel-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; }

        /* Steps / benefits */
        .steps { display: flex; flex-direction: column; gap: 16px; animation: fadeUp 0.6s 0.2s ease both; }
        .step { display: flex; align-items: flex-start; gap: 12px; }
        .step-num {
          width: 24px; height: 24px; border-radius: 8px; flex-shrink: 0; margin-top: 1px;
          background: rgba(192,193,255,0.12);
          border: 1px solid rgba(192,193,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #C0C1FF;
          font-family: 'DM Mono', monospace;
        }
        .step-text { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5; }
        .step-text strong { display: block; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 2px; }

        /* Right panel */
        .auth-panel-right {
          flex: 1;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          padding: 40px 44px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .form-header { margin-bottom: 24px; animation: fadeUp 0.5s 0.15s ease both; }
        .form-title { font-size: 22px; font-weight: 700; color: #f0eeff; letter-spacing: -0.5px; margin-bottom: 5px; }
        .form-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); }
        .form-subtitle a { color: #C0C1FF; text-decoration: none; font-weight: 500; }
        .form-subtitle a:hover { color: #DDB7FF; }

        .form-row { display: flex; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; flex: 1; animation: fadeUp 0.5s ease both; }
        .form-group:nth-child(1) { animation-delay: 0.2s; }
        .form-group:nth-child(2) { animation-delay: 0.24s; }
        .form-group:nth-child(3) { animation-delay: 0.28s; }
        .form-group:nth-child(4) { animation-delay: 0.32s; }
        .form-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 0.8px; text-transform: uppercase; font-family: 'DM Mono', monospace; }
        .input-wrap { position: relative; }
        .form-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 13px;
          font-size: 13.5px; color: #f0eeff;
          font-family: 'Sora', sans-serif; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.2); }
        .form-input:focus { border-color: rgba(192,193,255,0.5); background: rgba(192,193,255,0.06); }

        .pass-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3);
          display: flex; align-items: center; padding: 4px; transition: color 0.15s;
        }
        .pass-toggle:hover { color: rgba(255,255,255,0.6); }

        /* strength bar */
        .strength-bar { display: flex; gap: 4px; margin-top: 6px; }
        .strength-seg { flex: 1; height: 3px; border-radius: 9999px; background: rgba(255,255,255,0.08); transition: background 0.3s; }
        .strength-label { font-size: 11px; font-family: 'DM Mono', monospace; margin-top: 4px; transition: color 0.3s; }

        .form-error { font-size: 12px; color: #ff7b7b; padding: 9px 13px; background: rgba(255,80,80,0.08); border: 1px solid rgba(255,80,80,0.2); border-radius: 10px; margin-bottom: 4px; animation: fadeUp 0.3s ease both; }

        .terms { font-size: 11.5px; color: rgba(255,255,255,0.3); margin-bottom: 14px; line-height: 1.5; animation: fadeUp 0.5s 0.36s ease both; }
        .terms a { color: rgba(192,193,255,0.6); text-decoration: none; }
        .terms a:hover { color: #C0C1FF; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }

        .submit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #0055cc 0%, #C0C1FF 100%);
          border: none; border-radius: 13px;
          font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff;
          cursor: pointer; letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(0,85,204,0.35);
          animation: fadeUp 0.5s 0.38s ease both;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,85,204,0.45); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 640px) {
          .auth-panel-left { display: none; }
          .auth-panel-right { padding: 32px 22px; }
          .form-row { flex-direction: column; }
        }
      `}</style>

      <div className="auth-page">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="auth-split">
          {/* ── LEFT PANEL ── */}
          <div className="auth-panel-left">
            <div className="brand">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <span className="brand-name">Curator Network</span>
            </div>

            <div className="panel-hero">
              <p className="panel-tagline">
                Start curating
                <br />
                <span>in minutes.</span>
              </p>
              <p className="panel-desc">
                Join a growing network of curators exchanging ideas in
                real-time. Encrypted. Contextual. Yours.
              </p>
            </div>

            <div className="steps">
              {[
                [
                  "01",
                  "Create your account",
                  "Pick a username and secure password.",
                ],
                ["02", "Join a room", "Enter any public or private channel."],
                [
                  "03",
                  "Start curating",
                  "Chat, share, and build in real-time.",
                ],
              ].map(([n, t, d]) => (
                <div className="step" key={n}>
                  <div className="step-num">{n}</div>
                  <div className="step-text">
                    <strong>{t}</strong>
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="auth-panel-right">
            <div className="form-header">
              <h1 className="form-title">Create account</h1>
              <p className="form-subtitle">
                Already a member? <Link to="/login">Sign in →</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-input"
                    type="text"
                    name="username"
                    placeholder="adnan_pal"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <input
                    className="form-input"
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    className="pass-toggle"
                    onClick={() => setShowPass((v) => !v)}
                  >
                    {showPass ? (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* strength meter */}
                {form.password && (
                  <>
                    <div className="strength-bar">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="strength-seg"
                          style={{
                            background:
                              i <= strength ? strengthColor : undefined,
                          }}
                        />
                      ))}
                    </div>
                    <div
                      className="strength-label"
                      style={{ color: strengthColor }}
                    >
                      {strengthLabel}
                    </div>
                  </>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="confirm"
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                  style={
                    form.confirm && form.confirm !== form.password
                      ? { borderColor: "rgba(255,80,80,0.5)" }
                      : {}
                  }
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <p className="terms">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </p>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="btn-spinner" /> Creating account…
                  </>
                ) : (
                  "Create account →"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
