import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";


export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);

     try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

       localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/chat");

      } catch (err) {
      console.log(err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

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
        @keyframes shimmerIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .auth-page {
          min-height: 100vh;
          background: #0d0d0f;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb-1 {
          width: 500px; height: 400px;
          top: -120px; left: -140px;
          background: rgba(130, 0, 246, 0.12);
          animation: orb1 9s ease-in-out infinite;
        }
        .orb-2 {
          width: 420px; height: 380px;
          bottom: -100px; right: -100px;
          background: rgba(192, 193, 255, 0.1);
          animation: orb2 12s ease-in-out infinite;
        }
        .orb-3 {
          width: 280px; height: 220px;
          top: 40%; left: 55%;
          background: rgba(221, 183, 255, 0.07);
          animation: orb1 14s ease-in-out infinite reverse;
        }
        /* noise */
        .auth-page::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        .auth-split {
          display: flex;
          width: min(960px, 95vw);
          min-height: 560px;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          position: relative;
          z-index: 1;
          animation: shimmerIn 0.5s ease both;
          box-shadow: 0 40px 80px rgba(0,0,0,0.4);
        }
        /* left panel */
        .auth-panel-left {
          width: 44%;
          background: linear-gradient(155deg, #1a0a2e 0%, #130d1f 50%, #0d0d0f 100%);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .auth-panel-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .brand { display: flex; align-items: center; gap: 10px; animation: fadeUp 0.5s ease both; }
        .brand-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #8200F6, #C0C1FF);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-icon svg { width: 18px; height: 18px; fill: white; }
        .brand-name { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        .panel-hero { animation: fadeUp 0.6s 0.1s ease both; }
        .panel-tagline {
          font-size: 28px; font-weight: 700; color: #fff;
          line-height: 1.25; letter-spacing: -0.6px;
          margin-bottom: 12px;
        }
        .panel-tagline span {
          background: linear-gradient(90deg, #C0C1FF, #DDB7FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .panel-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; }
        .panel-chips { display: flex; flex-direction: column; gap: 10px; animation: fadeUp 0.6s 0.2s ease both; }
        .panel-chip {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
        }
        .chip-dot { width: 6px; height: 6px; border-radius: 50%; background: #34D399; flex-shrink: 0; }
        .chip-text { font-size: 12px; color: rgba(255,255,255,0.5); font-family: 'DM Mono', monospace; letter-spacing: 0.5px; }

        /* right panel — form */
        .auth-panel-right {
          flex: 1;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          padding: 48px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .form-header { margin-bottom: 32px; animation: fadeUp 0.5s 0.15s ease both; }
        .form-title { font-size: 24px; font-weight: 700; color: #f0eeff; letter-spacing: -0.5px; margin-bottom: 6px; }
        .form-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); }
        .form-subtitle a { color: #C0C1FF; text-decoration: none; font-weight: 500; }
        .form-subtitle a:hover { color: #DDB7FF; }

        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; animation: fadeUp 0.5s ease both; }
        .form-group:nth-child(1) { animation-delay: 0.2s; }
        .form-group:nth-child(2) { animation-delay: 0.25s; }
        .form-group:nth-child(3) { animation-delay: 0.3s; }
        .form-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.45); letter-spacing: 0.8px; text-transform: uppercase; font-family: 'DM Mono', monospace; }
        .input-wrap { position: relative; }
        .form-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          font-size: 14px; color: #f0eeff;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.2); }
        .form-input:focus { border-color: rgba(192,193,255,0.5); background: rgba(192,193,255,0.06); }
        .pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3);
          display: flex; align-items: center; padding: 4px;
          transition: color 0.15s;
        }
        .pass-toggle:hover { color: rgba(255,255,255,0.6); }

        .form-error { font-size: 12px; color: #ff7b7b; padding: 10px 14px; background: rgba(255,80,80,0.08); border: 1px solid rgba(255,80,80,0.2); border-radius: 10px; margin-bottom: 4px; animation: fadeUp 0.3s ease both; }

        .forgot { text-align: right; margin-bottom: 6px; animation: fadeUp 0.5s 0.3s ease both; }
        .forgot a { font-size: 12px; color: rgba(192,193,255,0.6); text-decoration: none; }
        .forgot a:hover { color: #C0C1FF; }

        .submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #8200F6 0%, #C0C1FF 100%);
          border: none; border-radius: 14px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700; color: #fff;
          cursor: pointer; letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(130,0,246,0.35);
          margin-top: 8px;
          animation: fadeUp 0.5s 0.35s ease both;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(130,0,246,0.45); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* spinner inside button */
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }

        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; animation: fadeUp 0.5s 0.4s ease both; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .divider-text { font-size: 11px; color: rgba(255,255,255,0.25); font-family: 'DM Mono', monospace; letter-spacing: 1px; }

        .oauth-row { display: flex; gap: 10px; animation: fadeUp 0.5s 0.45s ease both; }
        .oauth-btn {
          flex: 1; padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.55);
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .oauth-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.85); }
        .oauth-btn svg { width: 16px; height: 16px; }

        @media (max-width: 640px) {
          .auth-panel-left { display: none; }
          .auth-panel-right { padding: 36px 24px; }
          .auth-split { border-radius: 20px; min-height: auto; }
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
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              </div>
              <span className="brand-name">Curator Network</span>
            </div>

            <div className="panel-hero">
              <p className="panel-tagline">Where ideas<br/><span>converge.</span></p>
              <p className="panel-desc">A real-time curator network for designers, thinkers, and builders. Private rooms. Encrypted logs. AI context.</p>
            </div>

            <div className="panel-chips">
              <div className="panel-chip"><span className="chip-dot"/><span className="chip-text">End-to-end encrypted</span></div>
              <div className="panel-chip"><span className="chip-dot"/><span className="chip-text">AI-powered context</span></div>
              <div className="panel-chip"><span className="chip-dot"/><span className="chip-text">Real-time sync</span></div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="auth-panel-right">
            <div className="form-header">
              <h1 className="form-title">Welcome back</h1>
              <p className="form-subtitle">
                No account?{" "}
                <Link to="/signup">Create one →</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email" name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <input
                    className="form-input"
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    style={{ paddingRight: "44px" }}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(v => !v)}>
                    {showPass
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && <div className="form-error">{error}</div>}

              <div className="forgot"><a href="#">Forgot password?</a></div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? <><div className="btn-spinner"/> Signing in…</> : "Sign in →"}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line"/>
              <span className="divider-text">or continue with</span>
              <div className="divider-line"/>
            </div>

            <div className="oauth-row">
              <button className="oauth-btn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="oauth-btn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}