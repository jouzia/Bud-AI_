import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   BUD AI  ·  Block 1: Auth Gateway
            ·  Block 2: Onboarding
   Stack: React + Tailwind (inline CSS-in-JS for
   glassmorphism since Tailwind CDN is used)
───────────────────────────────────────────── */

const G = {
  // Glassmorphism tokens
  glass: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.18)",
  glassBold: "rgba(255,255,255,0.14)",
  blur: "blur(24px)",
  blurHeavy: "blur(40px)",
  glow: "0 0 60px rgba(139,92,246,0.25), 0 0 120px rgba(99,102,241,0.1)",
  shadow: "0 25px 50px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
  shadowSm: "0 8px 32px rgba(0,0,0,0.3)",
};

// ── Animated particle background ──────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ── Cat mascot SVG (inline, animated) ─────────
function BudCat({ size = 80, mood = "happy", bounce = false }) {
  const colors = {
    happy: { body: "#a78bfa", eye: "#1e1b4b", blush: "#f9a8d4" },
    warning: { body: "#f59e0b", eye: "#451a03", blush: "#fcd34d" },
    info: { body: "#38bdf8", eye: "#0c4a6e", blush: "#bae6fd" },
  };
  const c = colors[mood] || colors.happy;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        animation: bounce ? "budBounce 1.2s ease-in-out infinite" : "budFloat 3s ease-in-out infinite",
        filter: "drop-shadow(0 4px 16px rgba(139,92,246,0.4))",
      }}
    >
      <style>{`
        @keyframes budFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes budBounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-12px) scale(1.05)} }
        @keyframes blinkEye { 0%,90%,100%{scaleY:1} 95%{scaleY:0.1} }
      `}</style>
      {/* Ears */}
      <polygon points="18,42 28,18 38,42" fill={c.body} />
      <polygon points="22,40 28,24 34,40" fill="#ede9fe" />
      <polygon points="62,42 72,18 82,42" fill={c.body} />
      <polygon points="66,40 72,24 78,40" fill="#ede9fe" />
      {/* Body */}
      <ellipse cx="50" cy="62" rx="28" ry="22" fill={c.body} />
      {/* Head */}
      <circle cx="50" cy="48" r="28" fill={c.body} />
      {/* Face */}
      <ellipse cx="40" cy="46" rx="5" ry="6" fill={c.eye} style={{ transformOrigin: "40px 46px" }} />
      <ellipse cx="60" cy="46" rx="5" ry="6" fill={c.eye} style={{ transformOrigin: "60px 46px" }} />
      {/* Shine */}
      <ellipse cx="42" cy="44" rx="2" ry="2.5" fill="white" opacity="0.8" />
      <ellipse cx="62" cy="44" rx="2" ry="2.5" fill="white" opacity="0.8" />
      {/* Blush */}
      <ellipse cx="34" cy="53" rx="6" ry="4" fill={c.blush} opacity="0.6" />
      <ellipse cx="66" cy="53" rx="6" ry="4" fill={c.blush} opacity="0.6" />
      {/* Nose + mouth */}
      <ellipse cx="50" cy="53" rx="3" ry="2" fill="#7c3aed" />
      <path d="M44,58 Q50,64 56,58" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="20" y1="52" x2="38" y2="54" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="56" x2="38" y2="56" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="62" y1="54" x2="80" y2="52" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="62" y1="56" x2="80" y2="56" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="34" cy="80" rx="10" ry="7" fill={c.body} />
      <ellipse cx="66" cy="80" rx="10" ry="7" fill={c.body} />
      <ellipse cx="31" cy="82" rx="3" ry="2.5" fill="#ede9fe" />
      <ellipse cx="37" cy="84" rx="3" ry="2.5" fill="#ede9fe" />
      <ellipse cx="63" cy="82" rx="3" ry="2.5" fill="#ede9fe" />
      <ellipse cx="69" cy="84" rx="3" ry="2.5" fill="#ede9fe" />
    </svg>
  );
}

// ── Glass Panel component ──────────────────────
function GlassPanel({ children, style = {}, className = "" }) {
  return (
    <div
      className={className}
      style={{
        background: G.glass,
        backdropFilter: G.blur,
        WebkitBackdropFilter: G.blur,
        border: `1px solid ${G.glassBorder}`,
        borderRadius: 24,
        boxShadow: G.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Input field ───────────────────────────────
function GlassInput({ label, type = "text", value, onChange, error, icon, placeholder }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const inputType = type === "password" && show ? "text" : type;
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ color: "rgba(196,181,253,0.8)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, zIndex: 1 }}>
            {icon}
          </span>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: icon ? "14px 16px 14px 48px" : "14px 16px",
            paddingRight: type === "password" ? 48 : 16,
            background: focused ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${error ? "rgba(248,113,113,0.6)" : focused ? "rgba(167,139,250,0.7)" : "rgba(255,255,255,0.15)"}`,
            borderRadius: 14,
            color: "#f5f3ff",
            fontSize: 15,
            outline: "none",
            transition: "all 0.3s ease",
            backdropFilter: "blur(8px)",
            fontFamily: "'Nunito', sans-serif",
            boxSizing: "border-box",
          }}
        />
        {type === "password" && (
          <button
            onClick={() => setShow(!show)}
            type="button"
            style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "rgba(196,181,253,0.7)",
            }}
          >
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <p style={{ color: "#f87171", fontSize: 12, marginTop: 6, marginLeft: 4 }}>{error}</p>}
    </div>
  );
}

// ── Glow Button ───────────────────────────────
function GlowBtn({ children, onClick, variant = "primary", style = {}, disabled = false }) {
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
      boxShadow: "0 0 24px rgba(124,58,237,0.5), 0 4px 16px rgba(0,0,0,0.3)",
      color: "#fff",
    },
    secondary: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.2)",
      color: "#e0e7ff",
      boxShadow: "none",
    },
    warning: {
      background: "linear-gradient(135deg, #f59e0b, #d97706)",
      boxShadow: "0 0 24px rgba(245,158,11,0.5), 0 4px 16px rgba(0,0,0,0.3)",
      color: "#fff",
    },
    success: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      boxShadow: "0 0 24px rgba(16,185,129,0.5), 0 4px 16px rgba(0,0,0,0.3)",
      color: "#fff",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "13px 28px",
        borderRadius: 14,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 15,
        fontWeight: 700,
        fontFamily: "'Nunito', sans-serif",
        transition: "all 0.3s ease",
        opacity: disabled ? 0.5 : 1,
        width: "100%",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Modal wrapper ─────────────────────────────
function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(6px)",
        padding: 20,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 460 }}>
        <GlassPanel style={{ padding: 32, position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.1)", border: "none",
              borderRadius: "50%", width: 36, height: 36,
              color: "#c4b5fd", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
          {title && <h3 style={{ color: "#e0e7ff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 20, marginTop: 0 }}>{title}</h3>}
          {children}
        </GlassPanel>
      </div>
    </div>
  );
}

// ─── BLOCK 1: Authentication Gateway ──────────
function AuthGateway({ onSuccess }) {
  const [mode, setMode] = useState("signin"); // 'signin' | 'login'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.includes("@") || !email.includes(".")) e.email = "Please enter a valid Gmail address";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (mode === "signin" && password !== confirmPassword) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "signin") {
        setEmailSent(true);
      } else {
        onSuccess();
      }
    }, 1800);
  };

  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>
      {/* Logo area */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <BudCat size={90} mood="happy" />
        <h1 style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 900,
          fontSize: 38,
          background: "linear-gradient(135deg, #a78bfa, #818cf8, #c4b5fd)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "8px 0 4px",
          letterSpacing: "-0.02em",
        }}>
          Bud AI
        </h1>
        <p style={{ color: "rgba(196,181,253,0.7)", fontFamily: "'Nunito', sans-serif", fontSize: 15, margin: 0 }}>
          Your proactive AI companion ✨
        </p>
      </div>

      <GlassPanel style={{ padding: "36px 40px" }}>
        {/* Tab switcher */}
        <div style={{
          display: "flex", background: "rgba(0,0,0,0.25)", borderRadius: 12,
          padding: 4, marginBottom: 32,
        }}>
          {["signin", "login"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErrors({}); setEmailSent(false); }}
              style={{
                flex: 1, padding: "10px 0",
                background: mode === m ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "transparent",
                border: "none", borderRadius: 10,
                color: mode === m ? "#fff" : "rgba(196,181,253,0.6)",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: mode === m ? "0 4px 12px rgba(124,58,237,0.4)" : "none",
              }}
            >
              {m === "signin" ? "✨ Sign Up" : "🔐 Log In"}
            </button>
          ))}
        </div>

        {emailSent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
            <h3 style={{ color: "#e0e7ff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 22, margin: "0 0 12px" }}>
              Check your inbox!
            </h3>
            <p style={{ color: "rgba(196,181,253,0.8)", fontFamily: "'Nunito', sans-serif", lineHeight: 1.6, margin: "0 0 20px" }}>
              We've sent a <strong style={{ color: "#a78bfa" }}>visual verification email</strong> to <strong style={{ color: "#a78bfa" }}>{email}</strong>. It's got that anime ✨ flair you'll love!
            </p>
            <div style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(167,139,250,0.3)",
              borderRadius: 14, padding: "16px 20px",
              marginBottom: 24,
            }}>
              <p style={{ color: "rgba(196,181,253,0.9)", fontFamily: "'Nunito', sans-serif", fontSize: 13, margin: 0 }}>
                🎌 Your verification email features the Bud mascot in anime style with an interactive button. Open it and click <em>"I'm Ready, Bud!"</em> to activate your account.
              </p>
            </div>
            <GlowBtn onClick={onSuccess} variant="primary">Continue to Setup →</GlowBtn>
          </div>
        ) : (
          <>
            <GlassInput
              label="Gmail Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon="📧"
              placeholder="you@gmail.com"
            />
            <GlassInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon="🔑"
              placeholder="••••••••"
            />
            {mode === "signin" && (
              <GlassInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirm}
                icon="✅"
                placeholder="••••••••"
              />
            )}

            {/* Real-time strength */}
            {password && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map((i) => {
                    const strength = password.length >= i * 3 ? 1 : 0;
                    const colors = ["#f87171", "#fbbf24", "#34d399", "#a78bfa"];
                    return (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 4,
                        background: strength ? colors[i - 1] : "rgba(255,255,255,0.1)",
                        transition: "background 0.3s",
                      }} />
                    );
                  })}
                </div>
                <p style={{ color: "rgba(196,181,253,0.6)", fontSize: 11, margin: 0 }}>
                  {password.length < 4 ? "Too weak" : password.length < 8 ? "Getting there..." : password.length < 12 ? "Good!" : "Strong! 💪"}
                </p>
              </div>
            )}

            <GlowBtn onClick={handleSubmit} variant="primary" disabled={loading}>
              {loading ? "🌀 Connecting to Bud..." : mode === "signin" ? "✨ Create My Account" : "🚀 Enter the World of Bud"}
            </GlowBtn>

            {mode === "login" && (
              <p style={{ textAlign: "center", marginTop: 16, color: "rgba(196,181,253,0.6)", fontFamily: "'Nunito', sans-serif", fontSize: 13 }}>
                Forgot password?{" "}
                <span style={{ color: "#a78bfa", cursor: "pointer", textDecoration: "underline" }}>
                  Reset via email
                </span>
              </p>
            )}
          </>
        )}
      </GlassPanel>

      <p style={{ textAlign: "center", marginTop: 20, color: "rgba(167,139,250,0.4)", fontSize: 12, fontFamily: "'Nunito', sans-serif" }}>
        Protected by Bud Security · Keys stored locally
      </p>
    </div>
  );
}

// ─── BLOCK 2: Onboarding ──────────────────────
function Onboarding({ onComplete }) {
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [trialModal, setTrialModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [apiInfoModal, setApiInfoModal] = useState(false);
  const [step, setStep] = useState(1); // 1 = nickname, 2 = tier

  const handleNicknameNext = () => {
    if (nickname.trim().length < 2) {
      setNicknameError("Give Bud a name to call you! (min 2 chars)");
      return;
    }
    setNicknameError("");
    setStep(2);
  };

  const handleTrial = () => setTrialModal(true);
  const handleMember = () => setMemberModal(true);

  const handleApiKeySubmit = () => {
    if (apiKey.trim().length < 20) {
      setApiKeyError("That doesn't look like a valid API key. Double-check it!");
      return;
    }
    setMemberModal(false);
    setApiKeyModal(false);
    onComplete({ nickname: nickname.trim(), tier: "member", apiKey });
  };

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <BudCat size={80} mood="happy" bounce />
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 30,
          color: "#e0e7ff", margin: "10px 0 6px",
        }}>
          {step === 1 ? "Nice to meet you! 🎌" : `Ready to roll, ${nickname}! 🚀`}
        </h2>
        <p style={{ color: "rgba(196,181,253,0.7)", fontFamily: "'Nunito', sans-serif", fontSize: 15 }}>
          {step === 1 ? "First, what should Bud call you?" : "Choose your access tier to begin."}
        </p>
      </div>

      <GlassPanel style={{ padding: "36px 40px" }}>
        {step === 1 ? (
          <>
            {/* Progress dot */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
              {[1, 2].map((s) => (
                <div key={s} style={{
                  width: s === step ? 24 : 8, height: 8, borderRadius: 4,
                  background: s <= step ? "linear-gradient(90deg, #7c3aed, #4f46e5)" : "rgba(255,255,255,0.15)",
                  transition: "all 0.4s ease",
                }} />
              ))}
            </div>

            <GlassInput
              label="Your Nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              error={nicknameError}
              icon="🌸"
              placeholder="e.g. Aether, Nova, Kai..."
            />

            <div style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(167,139,250,0.25)",
              borderRadius: 14, padding: "14px 18px", marginBottom: 24,
            }}>
              <p style={{ color: "rgba(196,181,253,0.85)", fontFamily: "'Nunito', sans-serif", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                💬 Bud will use your nickname to talk to you personally across all blocks — from the chatroom to the classroom. Make it uniquely yours!
              </p>
            </div>

            <GlowBtn onClick={handleNicknameNext} variant="primary">
              {nickname ? `I'm ${nickname}. Let's go! →` : "Set My Identity →"}
            </GlowBtn>
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
              {[1, 2].map((s) => (
                <div key={s} style={{
                  width: s === step ? 24 : 8, height: 8, borderRadius: 4,
                  background: s <= step ? "linear-gradient(90deg, #7c3aed, #4f46e5)" : "rgba(255,255,255,0.15)",
                  transition: "all 0.4s ease",
                }} />
              ))}
            </div>

            <p style={{ color: "rgba(196,181,253,0.7)", fontFamily: "'Nunito', sans-serif", fontSize: 13, textAlign: "center", marginBottom: 28, marginTop: 0 }}>
              Select an access tier to unlock your Bud experience
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Trial Card */}
              <button
                onClick={handleTrial}
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.35)",
                  borderRadius: 18, padding: "20px 24px",
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.3s ease",
                  fontFamily: "'Nunito', sans-serif",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(245,158,11,0.18)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(245,158,11,0.1)"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 36 }}>🌟</div>
                  <div>
                    <div style={{ color: "#fcd34d", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Trial Mode</div>
                    <div style={{ color: "rgba(252,211,77,0.7)", fontSize: 13 }}>Free · 3 uploads · 3 chats · No API key needed</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "rgba(245,158,11,0.6)", fontSize: 22 }}>→</div>
                </div>
              </button>

              {/* Member Card */}
              <button
                onClick={handleMember}
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(129,140,248,0.45)",
                  borderRadius: 18, padding: "20px 24px",
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.3s ease",
                  fontFamily: "'Nunito', sans-serif",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
              >
                <div style={{
                  position: "absolute", top: 10, right: 14,
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff", fontSize: 10, fontWeight: 800,
                  padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em",
                }}>RECOMMENDED</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 36 }}>👑</div>
                  <div>
                    <div style={{ color: "#a78bfa", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Member Mode</div>
                    <div style={{ color: "rgba(167,139,250,0.7)", fontSize: 13 }}>Unlimited · Full power · Bring your API key</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "rgba(129,140,248,0.6)", fontSize: 22 }}>→</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              style={{
                background: "none", border: "none", color: "rgba(196,181,253,0.5)",
                fontFamily: "'Nunito', sans-serif", fontSize: 13, cursor: "pointer",
                marginTop: 20, display: "block", width: "100%", textAlign: "center",
              }}
            >
              ← Back (change nickname)
            </button>
          </>
        )}
      </GlassPanel>

      {/* ── Trial Warning Modal ────────── */}
      <Modal open={trialModal} onClose={() => setTrialModal(false)} title="">
        <div style={{ textAlign: "center" }}>
          <BudCat size={80} mood="warning" bounce />
          <h3 style={{
            color: "#fcd34d", fontFamily: "'Nunito', sans-serif",
            fontWeight: 900, fontSize: 22, margin: "12px 0 8px",
          }}>
            Heads up, {nickname}! ⚠️
          </h3>
          <p style={{ color: "rgba(252,211,77,0.8)", fontFamily: "'Nunito', sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Trial mode is limited! Bud can only help you with:
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
            {["3 Uploads 📁", "3 Chats 💬", "Core Features ✨"].map((item) => (
              <div key={item} style={{
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 12, padding: "10px 14px",
                color: "#fcd34d", fontSize: 13, fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
              }}>
                {item}
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(196,181,253,0.7)", fontFamily: "'Nunito', sans-serif", fontSize: 13, marginBottom: 24 }}>
            Bud will remind you gently when you're close to the limit. You can always upgrade later!
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <GlowBtn
              onClick={() => { setTrialModal(false); onComplete({ nickname: nickname.trim(), tier: "trial" }); }}
              variant="warning"
              style={{ flex: 1 }}
            >
              I understand, let's try! →
            </GlowBtn>
            <GlowBtn
              onClick={() => { setTrialModal(false); setMemberModal(true); }}
              variant="secondary"
              style={{ flex: 1 }}
            >
              Go Member instead
            </GlowBtn>
          </div>
        </div>
      </Modal>

      {/* ── Member / API Key Modal ────── */}
      <Modal open={memberModal} onClose={() => setMemberModal(false)} title="🔑 Member Access">
        <p style={{ color: "rgba(196,181,253,0.8)", fontFamily: "'Nunito', sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          Enter your Gemini API key to unlock unlimited access. Your key is stored <strong style={{ color: "#a78bfa" }}>locally on your device</strong> and never shared with Bud servers.
        </p>

        <div style={{ position: "relative", marginBottom: 8 }}>
          <GlassInput
            label="API Key (Gemini / Google AI Studio)"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            error={apiKeyError}
            icon="🗝️"
            placeholder="AIzaSy..."
          />
        </div>

        <button
          onClick={() => { setMemberModal(false); setApiInfoModal(true); }}
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(129,140,248,0.3)",
            borderRadius: 10, padding: "10px 16px",
            color: "#818cf8", fontFamily: "'Nunito', sans-serif",
            fontSize: 13, cursor: "pointer", width: "100%",
            marginBottom: 20, fontWeight: 700,
          }}
        >
          ℹ️ How do I get a Gemini API key? (Step-by-step guide)
        </button>

        <div style={{ display: "flex", gap: 12 }}>
          <GlowBtn onClick={handleApiKeySubmit} variant="success" style={{ flex: 1 }}>
            Activate Member Mode 👑
          </GlowBtn>
        </div>

        <p style={{ color: "rgba(167,139,250,0.4)", fontSize: 11, fontFamily: "'Nunito', sans-serif", textAlign: "center", marginTop: 16 }}>
          🔒 Encrypted in localStorage · Never transmitted · You own your key
        </p>
      </Modal>

      {/* ── API Info / Guide Modal ──────── */}
      <Modal open={apiInfoModal} onClose={() => { setApiInfoModal(false); setMemberModal(true); }} title="🗺️ How to Get Your Gemini API Key">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { step: "1", icon: "🌐", title: "Go to Google AI Studio", desc: "Visit aistudio.google.com in your browser." },
            { step: "2", icon: "🔐", title: "Sign in with Google", desc: "Use your Gmail account to log into AI Studio." },
            { step: "3", icon: "🗝️", title: "Get API Key", desc: 'Click "Get API key" → "Create API key in new project".' },
            { step: "4", icon: "📋", title: "Copy your key", desc: "Copy the key starting with AIzaSy... and paste it here." },
            { step: "5", icon: "🤖", title: "Recommended model", desc: "Bud AI works best with gemini-2.0-flash or gemini-1.5-pro for 100k+ context." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14, padding: "14px 16px",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: 14,
                flexShrink: 0,
              }}>{step}</div>
              <div>
                <div style={{ color: "#e0e7ff", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
                  {icon} {title}
                </div>
                <div style={{ color: "rgba(196,181,253,0.7)", fontFamily: "'Nunito', sans-serif", fontSize: 13 }}>{desc}</div>
              </div>
            </div>
          ))}

          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block", textAlign: "center",
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "#fff", padding: "13px 0",
              borderRadius: 14, textDecoration: "none",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15,
              boxShadow: "0 0 24px rgba(124,58,237,0.4)",
            }}
          >
            🚀 Open Google AI Studio →
          </a>

          <div style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(52,211,153,0.25)",
            borderRadius: 12, padding: "12px 16px",
          }}>
            <p style={{ color: "rgba(52,211,153,0.9)", fontFamily: "'Nunito', sans-serif", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              🔒 <strong>Privacy note:</strong> Your API key is encrypted and stored only in your browser's localStorage. Bud AI's servers never see, log, or transmit your key. You retain full ownership.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────
export default function Auth({ onComplete }) {
  const [page, setPage] = useState("auth"); // auth | onboard

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0824 0%, #0d1117 30%, #13082a 60%, #0a0f1e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: "fixed", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        top: -200, left: -200, pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
        bottom: -150, right: -150, pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(196,181,253,0.08) 0%, transparent 70%)",
        top: "40%", right: "15%", pointerEvents: "none", zIndex: 0,
      }} />

      <ParticleField />

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {page === "auth" && (
          <AuthGateway onSuccess={() => setPage("onboard")} />
        )}
        {page === "onboard" && (
          <Onboarding onComplete={(data) => {
            onComplete(data);
          }} />
        )}
      </div>
    </div>
  );
}
