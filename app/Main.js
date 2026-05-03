import { useState, useEffect, useRef, useCallback } from "react";
import ThreeMascot from "./ThreeMascot";

/* ═══════════════════════════════════════════════════════════════
   BUD AI  ·  BLOCKS 3 & 4
   ─ Block 3 : API Management System (Settings modal)
   ─ Block 4 : Main Dashboard
       ↳ Proactive Buddy Core (idle detection + Gemini AI)
       ↳ Hidden Navigation Overlay Grid
       ↳ Moods System (6 moods, palette shifts, slide-detail)
       ↳ Mascot Carousel (3D-style SVG carousel, mood animations)
       ↳ Footer Controls (Settings, New Chat)
   Stack: React 18, inline CSS-in-JS glassmorphism
   Primary AI: Google Gemini via REST API
═══════════════════════════════════════════════════════════════ */

// ── Mood definitions ───────────────────────────────────────────
const MOODS = {
  motivated: {
    id: "motivated", label: "Motivated", sub: "The Hustler",
    icon: "⚡", emoji: "💪",
    grad: ["#f59e0b", "#d97706", "#b45309"],
    glow: "rgba(245,158,11,0.35)",
    glass: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.3)",
    text: "#fcd34d",
    bg: "linear-gradient(135deg, #0f0824 0%, #1a0d00 40%, #0d0800 100%)",
    orb1: "rgba(245,158,11,0.18)", orb2: "rgba(180,83,9,0.12)",
    dialogue: [
      "Let's get it! No more waiting — what are we building today?",
      "You've been quiet for a while. A champion doesn't rest this long!",
      "Every minute idle is a minute wasted. What's the mission?",
      "I see you thinking... channel that energy into action!",
    ],
    mascotAction: "powerup",
    desc: "High-energy mode. Bud proactively pushes you when you're idling. Bold gold accents flood the interface.",
  },
  calm: {
    id: "calm", label: "Calm", sub: "The Zen Buddy",
    icon: "🌊", emoji: "🌙",
    grad: ["#0ea5e9", "#0284c7", "#0369a1"],
    glow: "rgba(14,165,233,0.3)",
    glass: "rgba(14,165,233,0.07)",
    border: "rgba(14,165,233,0.25)",
    text: "#bae6fd",
    bg: "linear-gradient(135deg, #050d1a 0%, #061525 50%, #030d1a 100%)",
    orb1: "rgba(14,165,233,0.15)", orb2: "rgba(6,182,212,0.1)",
    dialogue: [
      "Take your time. I'm right here whenever you need me.",
      "Late night study session? I'll keep the pace gentle.",
      "Breathe. Whatever it is, we'll figure it out together.",
      "No rush. What would you like to explore at your own pace?",
    ],
    mascotAction: "float",
    desc: "Soft, reassuring mode. Perfect for late-night classroom sessions. Deep ocean blue washes the UI.",
  },
  focused: {
    id: "focused", label: "Focused", sub: "The Scholar",
    icon: "🎯", emoji: "📐",
    grad: ["#e2e8f0", "#cbd5e1", "#94a3b8"],
    glow: "rgba(226,232,240,0.2)",
    glass: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.2)",
    text: "#f1f5f9",
    bg: "linear-gradient(135deg, #080808 0%, #111118 50%, #080808 100%)",
    orb1: "rgba(255,255,255,0.06)", orb2: "rgba(200,200,220,0.04)",
    dialogue: [
      "Minimal. Precise. What's the technical problem?",
      "Deep work mode active. Fire away.",
      "Zero distractions. What do you need solved?",
      "Scholar mode. I'll stay quiet until you need me.",
    ],
    mascotAction: "study",
    desc: "Minimalist and direct. Bud stays silent until called. Frosted white glass with sharp architectural borders.",
  },
  playful: {
    id: "playful", label: "Playful", sub: "Chibi Mode",
    icon: "🌸", emoji: "✨",
    grad: ["#e879f9", "#d946ef", "#a21caf"],
    glow: "rgba(232,121,249,0.4)",
    glass: "rgba(232,121,249,0.1)",
    border: "rgba(232,121,249,0.35)",
    text: "#f5d0fe",
    bg: "linear-gradient(135deg, #0d0015 0%, #1a0025 40%, #0d0015 100%)",
    orb1: "rgba(232,121,249,0.2)", orb2: "rgba(167,139,250,0.15)",
    dialogue: [
      "OMG HIIII~! (づ｡◕‿‿◕｡)づ What are we doing today senpai??",
      "Nyaa~! You're back!! I missed you SO MUCH uwu ✨",
      "bro bro bro... i have the BEST idea rn no cap 🌸",
      "poggers!! let's gooo~ what's the vibe today??",
    ],
    mascotAction: "spin",
    desc: "Full chibi anime mode. Emojis, slang, pop-out animations. Vibrant neon-pink and purple glass.",
  },
  grumpy: {
    id: "grumpy", label: "Grumpy", sub: "The Sassy One",
    icon: "💢", emoji: "😤",
    grad: ["#ef4444", "#dc2626", "#b91c1c"],
    glow: "rgba(239,68,68,0.3)",
    glass: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.25)",
    text: "#fca5a5",
    bg: "linear-gradient(135deg, #0a0005 0%, #180308 50%, #0a0005 100%)",
    orb1: "rgba(239,68,68,0.12)", orb2: "rgba(100,60,60,0.1)",
    dialogue: [
      "Finally. I was starting to think you abandoned me.",
      "Oh, so NOW you decide to show up. Charming.",
      "You know, a simple 'hello' wouldn't have killed you.",
      "I've been here this whole time. Did you notice? No. Fine.",
    ],
    mascotAction: "grump",
    desc: "Witty and sarcastic. Bud complains if you're idle too long. Dark smoke glass with deep red accents.",
  },
  empathetic: {
    id: "empathetic", label: "Empathetic", sub: "The Listener",
    icon: "💜", emoji: "🌺",
    grad: ["#c084fc", "#a855f7", "#7c3aed"],
    glow: "rgba(192,132,252,0.35)",
    glass: "rgba(192,132,252,0.08)",
    border: "rgba(192,132,252,0.3)",
    text: "#e9d5ff",
    bg: "linear-gradient(135deg, #0d0520 0%, #140828 50%, #0d0520 100%)",
    orb1: "rgba(192,132,252,0.18)", orb2: "rgba(251,191,36,0.08)",
    dialogue: [
      "Hey... how are you actually doing today?",
      "You seem a little quiet. Want to talk about it?",
      "It's okay to take a break. I'm not going anywhere.",
      "Whatever's weighing on you — I'm here, no judgment.",
    ],
    mascotAction: "hug",
    desc: "Validation-first mode. Bud checks in on you emotionally. Warm lavender and sunset peach tones.",
  },
};

// ── Mascot SVG with mood-based animations ─────────────────────
function BudMascot({ mood = "motivated", size = 100, action = false, style: extStyle = {} }) {
  const m = MOODS[mood] || MOODS.motivated;
  const animName = `bud_${mood}_${action ? "action" : "idle"}`;

  const bodyColor = {
    motivated: "#f59e0b", calm: "#38bdf8", focused: "#94a3b8",
    playful: "#e879f9", grumpy: "#ef4444", empathetic: "#c084fc",
  }[mood] || "#a78bfa";

  const blushColor = {
    motivated: "#fed7aa", calm: "#bae6fd", focused: "#e2e8f0",
    playful: "#fbcfe8", grumpy: "#fecaca", empathetic: "#f3e8ff",
  }[mood] || "#f3e8ff";

  const expressions = {
    motivated: { eyes: "determined", mouth: "grin" },
    calm: { eyes: "peaceful", mouth: "smile" },
    focused: { eyes: "sharp", mouth: "line" },
    playful: { eyes: "stars", mouth: "wide" },
    grumpy: { eyes: "angry", mouth: "frown" },
    empathetic: { eyes: "soft", mouth: "gentle" },
  }[mood] || { eyes: "happy", mouth: "smile" };

  const getAnim = () => {
    if (!action) {
      const idles = { motivated: "budBounce", calm: "budFloat", focused: "budNod", playful: "budSpin", grumpy: "budShake", empathetic: "budBreath" };
      return `${idles[mood] || "budFloat"} ${mood === "calm" ? "4s" : mood === "focused" ? "6s" : "2.5s"} ease-in-out infinite`;
    }
    const actions = { motivated: "budPowerUp", calm: "budWave", focused: "budFlip", playful: "budDance", grumpy: "budStamp", empathetic: "budHug" };
    return `${actions[mood] || "budPowerUp"} 1s ease-in-out 3`;
  };

  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      style={{
        animation: getAnim(),
        filter: `drop-shadow(0 6px 20px ${m.glow})`,
        ...extStyle,
      }}
    >
      <style>{`
        @keyframes budFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes budBounce{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-14px) scale(1.06)}70%{transform:translateY(-6px) scale(1.02)}}
        @keyframes budNod{0%,100%{transform:rotate(0deg)}20%{transform:rotate(-3deg)}60%{transform:rotate(3deg)}}
        @keyframes budSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes budShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
        @keyframes budBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes budPowerUp{0%{transform:scale(1)}30%{transform:scale(1.3) rotate(-5deg)}60%{transform:scale(0.9) rotate(5deg)}100%{transform:scale(1.15)}}
        @keyframes budWave{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-10deg)}75%{transform:rotate(10deg)}}
        @keyframes budFlip{0%{transform:rotateY(0deg)}50%{transform:rotateY(180deg)}100%{transform:rotateY(360deg)}}
        @keyframes budDance{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-10px) rotate(-15deg)}75%{transform:translateY(-10px) rotate(15deg)}}
        @keyframes budStamp{0%,100%{transform:translateY(0)}50%{transform:translateY(8px) scale(1.1)}}
        @keyframes budHug{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
      `}</style>
      {/* Ears */}
      <polygon points="18,42 28,16 38,42" fill={bodyColor} />
      <polygon points="23,40 28,22 33,40" fill="rgba(255,255,255,0.3)" />
      <polygon points="62,42 72,16 82,42" fill={bodyColor} />
      <polygon points="67,40 72,22 77,40" fill="rgba(255,255,255,0.3)" />
      {/* Tail */}
      <path d={mood === "grumpy" ? "M72,75 Q90,60 88,80" : "M72,75 Q92,65 88,82"} stroke={bodyColor} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="50" cy="64" rx="26" ry="20" fill={bodyColor} />
      <ellipse cx="50" cy="60" rx="16" ry="12" fill="rgba(255,255,255,0.18)" />
      {/* Head */}
      <circle cx="50" cy="46" r="28" fill={bodyColor} />
      {/* Shading */}
      <ellipse cx="42" cy="38" rx="10" ry="8" fill="rgba(255,255,255,0.12)" />
      {/* Eyes based on expression */}
      {expressions.eyes === "stars" ? (
        <>
          <text x="38" y="50" fontSize="12" textAnchor="middle" fill="white">★</text>
          <text x="62" y="50" fontSize="12" textAnchor="middle" fill="white">★</text>
        </>
      ) : expressions.eyes === "angry" ? (
        <>
          <ellipse cx="39" cy="46" rx="6" ry="5" fill="#1a0000" />
          <line x1="33" y1="40" x2="45" y2="43" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="61" cy="46" rx="6" ry="5" fill="#1a0000" />
          <line x1="67" y1="40" x2="55" y2="43" stroke="#1a0000" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : expressions.eyes === "peaceful" ? (
        <>
          <path d="M33,46 Q39,41 45,46" stroke="#0c1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M55,46 Q61,41 67,46" stroke="#0c1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="39" cy="46" rx="6" ry="7" fill="rgba(15,15,30,0.85)" />
          <ellipse cx="61" cy="46" rx="6" ry="7" fill="rgba(15,15,30,0.85)" />
          <ellipse cx="41" cy="44" rx="2.5" ry="3" fill="white" opacity="0.9" />
          <ellipse cx="63" cy="44" rx="2.5" ry="3" fill="white" opacity="0.9" />
        </>
      )}
      {/* Blush */}
      <ellipse cx="32" cy="53" rx="7" ry="4.5" fill={blushColor} opacity="0.55" />
      <ellipse cx="68" cy="53" rx="7" ry="4.5" fill={blushColor} opacity="0.55" />
      {/* Nose */}
      <ellipse cx="50" cy="53" rx="3.5" ry="2.5" fill="rgba(15,15,30,0.6)" />
      {/* Mouth */}
      {expressions.mouth === "frown"
        ? <path d="M44,60 Q50,55 56,60" stroke="rgba(15,15,30,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
        : expressions.mouth === "line"
          ? <line x1="45" y1="59" x2="55" y2="59" stroke="rgba(15,15,30,0.7)" strokeWidth="2" strokeLinecap="round" />
          : <path d="M44,58 Q50,65 56,58" stroke="rgba(15,15,30,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
      }
      {/* Whiskers */}
      <line x1="18" y1="51" x2="37" y2="53" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="56" x2="37" y2="56" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="63" y1="53" x2="82" y2="51" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="63" y1="56" x2="82" y2="56" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="36" cy="80" rx="11" ry="8" fill={bodyColor} />
      <ellipse cx="64" cy="80" rx="11" ry="8" fill={bodyColor} />
      <ellipse cx="33" cy="83" rx="3.5" ry="3" fill="rgba(255,255,255,0.25)" />
      <ellipse cx="39" cy="85" rx="3.5" ry="3" fill="rgba(255,255,255,0.25)" />
      <ellipse cx="61" cy="83" rx="3.5" ry="3" fill="rgba(255,255,255,0.25)" />
      <ellipse cx="67" cy="85" rx="3.5" ry="3" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}

// ── Shared glass panel ─────────────────────────────────────────
function GP({ children, mood = "motivated", style: s = {}, onClick }) {
  const m = MOODS[mood];
  return (
    <div onClick={onClick} style={{
      background: m.glass,
      backdropFilter: "blur(28px) saturate(180%)",
      WebkitBackdropFilter: "blur(28px) saturate(180%)",
      border: `1px solid ${m.border}`,
      borderRadius: 20,
      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${m.glow}`,
      ...s,
    }}>{children}</div>
  );
}

// ── Particle canvas ────────────────────────────────────────────
function Particles({ mood }) {
  const ref = useRef(null);
  const mRef = useRef(mood);
  mRef.current = mood;
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const ps = Array.from({ length: 55 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 2.2 + 0.4, dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35, o: Math.random() * 0.45 + 0.08,
    }));
    let raf;
    const draw = () => {
      const glowColor = MOODS[mRef.current]?.glow || "rgba(139,92,246,0.25)";
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = glowColor.replace(/[\d.]+\)$/, `${p.o})`);
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > c.width) p.dx *= -1;
        if (p.y < 0 || p.y > c.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ── SVG Icons ──────────────────────────────────────────────────
const Ico = {
  Home: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  Chat: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  Upload: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" /></svg>,
  Book: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
  Calendar: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  Mood: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 13s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>,
  Mascot: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" /></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  Key: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-4-4" /></svg>,
  Mic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>,
  Info: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
};

// ── Moods Overlay ──────────────────────────────────────────────
function MoodsOverlay({ open, onClose, currentMood, onSelect }) {
  const [selected, setSelected] = useState(null);
  if (!open) return null;
  const m = MOODS[currentMood];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={() => { setSelected(null); onClose(); }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 560 }}>
        {selected ? (
          // Deep-dive slide
          <div style={{
            background: MOODS[selected].glass,
            backdropFilter: "blur(30px)",
            border: `1px solid ${MOODS[selected].border}`,
            borderRadius: 24, padding: 36,
            boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 50px ${MOODS[selected].glow}`,
            animation: "slideUp 0.35s ease",
          }}>
            <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
            <button onClick={() => setSelected(null)} style={{
              background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%",
              width: 36, height: 36, color: MOODS[selected].text, cursor: "pointer",
              fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
            }}>←</button>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <BudMascot mood={selected} size={70} action />
              <div>
                <div style={{ color: MOODS[selected].text, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26 }}>
                  {MOODS[selected].icon} {MOODS[selected].label} Mode
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Nunito',sans-serif", fontSize: 14 }}>
                  {MOODS[selected].sub}
                </div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Nunito',sans-serif", lineHeight: 1.75, fontSize: 15, marginBottom: 24 }}>
              {MOODS[selected].desc}
            </p>
            <div style={{
              background: "rgba(0,0,0,0.25)", borderRadius: 14, padding: "14px 18px", marginBottom: 24,
              border: `1px solid ${MOODS[selected].border}`,
            }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                Bud's Opening Line
              </div>
              <div style={{ color: MOODS[selected].text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontStyle: "italic" }}>
                "{MOODS[selected].dialogue[0]}"
              </div>
            </div>
            <button onClick={() => { onSelect(selected); setSelected(null); onClose(); }} style={{
              width: "100%", padding: "14px 0",
              background: `linear-gradient(135deg, ${MOODS[selected].grad[0]}, ${MOODS[selected].grad[1]})`,
              border: "none", borderRadius: 14,
              color: "#fff", fontFamily: "'Nunito',sans-serif",
              fontWeight: 800, fontSize: 16, cursor: "pointer",
              boxShadow: `0 0 30px ${MOODS[selected].glow}`,
            }}>
              Activate {MOODS[selected].label} Mode →
            </button>
          </div>
        ) : (
          // 6-tile grid
          <div style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24, padding: 32,
          }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ color: m.text, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22 }}>
                Choose Bud's Mood
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Nunito',sans-serif", fontSize: 13, marginTop: 4 }}>
                Currently: {m.icon} {m.label}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {Object.values(MOODS).map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setSelected(mood.id)}
                  style={{
                    background: currentMood === mood.id ? mood.glass : "rgba(255,255,255,0.04)",
                    border: `1px solid ${currentMood === mood.id ? mood.border : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 16, padding: "18px 12px",
                    cursor: "pointer", textAlign: "center",
                    transition: "all 0.25s ease",
                    position: "relative",
                    boxShadow: currentMood === mood.id ? `0 0 20px ${mood.glow}` : "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = mood.glass; e.currentTarget.style.transform = "scale(1.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = currentMood === mood.id ? mood.glass : "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {currentMood === mood.id && (
                    <div style={{
                      position: "absolute", top: 8, right: 8, width: 8, height: 8,
                      borderRadius: "50%", background: mood.grad[0],
                      boxShadow: `0 0 8px ${mood.glow}`,
                    }} />
                  )}
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{mood.icon}</div>
                  <div style={{ color: mood.text, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13 }}>{mood.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Nunito',sans-serif", fontSize: 11, marginTop: 2 }}>{mood.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mascot Carousel ────────────────────────────────────────────
const MASCOTS = [
  { id: "cat", name: "Bud", type: "The Original", color: "#a78bfa" },
  { id: "fox", name: "Kaze", type: "The Swift One", color: "#f59e0b" },
  { id: "bear", name: "Ryu", type: "The Steadfast", color: "#38bdf8" },
  { id: "wolf", name: "Sora", type: "The Lone Scout", color: "#ef4444" },
  { id: "bunny", name: "Hana", type: "The Gentle Soul", color: "#e879f9" },
];

function MascotCarousel({ open, onClose, mood, activeMascot, onSelect }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [actionMascot, setActionMascot] = useState(null);
  const count = MASCOTS.length;

  if (!open) return null;
  const m = MOODS[mood];

  const spin = (dir) => {
    if (isSpinning) return;
    setIsSpinning(true);
    setRotation(r => r + dir * (360 / count));
    setTimeout(() => setIsSpinning(false), 450);
  };

  const getCenterIndex = () => {
    const norm = ((rotation % 360) + 360) % 360;
    return Math.round(norm / (360 / count)) % count;
  };

  const centerIdx = getCenterIndex();
  const handleActivate = () => {
    setActionMascot(centerIdx);
    setTimeout(() => setActionMascot(null), 3000);
    onSelect(MASCOTS[centerIdx].id);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 520 }}>
        <div style={{
          background: m.glass, backdropFilter: "blur(30px)",
          border: `1px solid ${m.border}`, borderRadius: 28,
          padding: 36, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${m.glow}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div style={{ color: m.text, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22 }}>
              Mascot Gallery
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 36, height: 36, color: m.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico.Close />
            </button>
          </div>

          {/* Carousel stage */}
          <div style={{ position: "relative", height: 220, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            {MASCOTS.map((mascot, i) => {
              const angle = ((i * (360 / count)) - rotation) * (Math.PI / 180);
              const rx = 160, ry = 50;
              const x = Math.sin(angle) * rx;
              const z = Math.cos(angle);
              const scale = 0.5 + 0.5 * ((z + 1) / 2);
              const opacity = 0.3 + 0.7 * ((z + 1) / 2);
              const isCenter = i === centerIdx;
              return (
                <div
                  key={mascot.id}
                  style={{
                    position: "absolute",
                    transform: `translateX(${x}px) scale(${isCenter ? scale * 1.15 : scale})`,
                    opacity,
                    zIndex: isCenter ? 10 : Math.floor(z * 5 + 5),
                    transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onClick={() => { if (!isCenter) spin(i > centerIdx ? -1 : 1); else handleActivate(); }}
                >
                  <div style={{
                    padding: isCenter ? "12px 16px" : "8px 12px",
                    background: isCenter ? m.glass : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isCenter ? m.border : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 20,
                    boxShadow: isCenter ? `0 0 30px ${m.glow}` : "none",
                    transition: "all 0.45s ease",
                    overflow: "hidden",
                  }}>
                    {isCenter ? (
                      <div style={{ width: 250, height: 250, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ThreeMascot mascotName={mascot.id} isDark={true} />
                      </div>
                    ) : (
                      <BudMascot
                        mood={mood}
                        size={55}
                        action={actionMascot === i}
                      />
                    )}
                    {isCenter && (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ color: m.text, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14 }}>{mascot.name}</div>
                        <div style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Nunito',sans-serif", fontSize: 11 }}>{mascot.type}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel controls */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button onClick={() => spin(-1)} style={{
              flex: 1, padding: "12px 0", background: "rgba(255,255,255,0.06)",
              border: `1px solid ${m.border}`, borderRadius: 14,
              color: m.text, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 20,
              cursor: "pointer", transition: "all 0.2s",
            }}>←</button>
            <button onClick={handleActivate} style={{
              flex: 2, padding: "12px 0",
              background: `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`,
              border: "none", borderRadius: 14,
              color: "#fff", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15,
              cursor: "pointer", boxShadow: `0 0 25px ${m.glow}`,
            }}>
              Select {MASCOTS[centerIdx]?.name} ✨
            </button>
            <button onClick={() => spin(1)} style={{
              flex: 1, padding: "12px 0", background: "rgba(255,255,255,0.06)",
              border: `1px solid ${m.border}`, borderRadius: 14,
              color: m.text, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 20,
              cursor: "pointer", transition: "all 0.2s",
            }}>→</button>
          </div>

          {/* Mood action label */}
          <div style={{
            textAlign: "center", padding: "10px 16px",
            background: "rgba(0,0,0,0.25)", borderRadius: 12,
            border: `1px solid ${m.border}`,
          }}>
            <span style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Nunito',sans-serif", fontSize: 12 }}>
              Current mood animation: </span>
            <span style={{ color: m.text, fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 700 }}>
              {m.mascotAction.toUpperCase()} · {m.label} mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Settings / API Modal (Block 3) ─────────────────────────────
function SettingsModal({ open, onClose, mood, apiKey, setApiKey }) {
  const [key, setKey] = useState(apiKey);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const m = MOODS[mood];

  if (!open) return null;
  const handleSave = () => { setApiKey(key); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480 }}>
        <div style={{
          background: m.glass, backdropFilter: "blur(30px)",
          border: `1px solid ${m.border}`, borderRadius: 24,
          padding: 36, boxShadow: `0 25px 60px rgba(0,0,0,0.6)`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ color: m.text, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20 }}>
              API Management
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 36, height: 36, color: m.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico.Close />
            </button>
          </div>

          {/* API key input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "'Nunito',sans-serif" }}>
              Gemini API Key
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: m.text }}>
                <Ico.Key />
              </div>
              <input
                type={show ? "text" : "password"}
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="AIzaSy..."
                style={{
                  width: "100%", padding: "13px 48px 13px 44px",
                  background: "rgba(0,0,0,0.3)", border: `1px solid ${m.border}`,
                  borderRadius: 13, color: "#fff", fontSize: 14, outline: "none",
                  fontFamily: "'Nunito',sans-serif", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
              <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            onClick={() => setInfoOpen(!infoOpen)}
            style={{
              width: "100%", padding: "11px 16px",
              background: "rgba(255,255,255,0.05)", border: `1px solid ${m.border}`,
              borderRadius: 12, color: m.text, fontFamily: "'Nunito',sans-serif",
              fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
            }}
          >
            <Ico.Info /> How to get a Gemini key · Step-by-step guide
          </button>

          {infoOpen && (
            <div style={{ marginBottom: 16 }}>
              {[
                { n: 1, title: "Visit Google AI Studio", body: "Go to aistudio.google.com in your browser." },
                { n: 2, title: "Sign in with Gmail", body: "Use your Google account to authenticate." },
                { n: 3, title: "Get API key", body: 'Click "Get API key" → "Create API key in new project".' },
                { n: 4, title: "Copy the key", body: "Key starts with AIzaSy... Paste it above." },
                { n: 5, title: "Recommended model", body: "Use gemini-2.0-flash for speed or gemini-1.5-pro for 100k context." },
              ].map(({ n, title, body }) => (
                <div key={n} style={{
                  display: "flex", gap: 12, padding: "10px 14px", marginBottom: 8,
                  background: "rgba(0,0,0,0.2)", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 900, fontSize: 12, fontFamily: "'Nunito',sans-serif",
                  }}>{n}</div>
                  <div>
                    <div style={{ color: "#e0e7ff", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13 }}>{title}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Nunito',sans-serif", fontSize: 12 }}>{body}</div>
                  </div>
                </div>
              ))}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{
                display: "block", textAlign: "center", padding: "11px 0",
                background: `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`,
                color: "#fff", borderRadius: 12, textDecoration: "none",
                fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, marginBottom: 12,
              }}>
                Open Google AI Studio →
              </a>
              <div style={{
                background: "rgba(16,185,129,0.1)", border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: 10, padding: "10px 14px",
              }}>
                <p style={{ color: "rgba(52,211,153,0.85)", fontFamily: "'Nunito',sans-serif", fontSize: 12, margin: 0 }}>
                  🔒 Your key is encrypted and stored only in localStorage. Bud AI servers never see, log, or transmit it.
                </p>
              </div>
            </div>
          )}

          <button onClick={handleSave} style={{
            width: "100%", padding: "14px 0",
            background: saved
              ? "linear-gradient(135deg, #10b981, #059669)"
              : `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`,
            border: "none", borderRadius: 14, color: "#fff",
            fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer",
            boxShadow: `0 0 25px ${m.glow}`, transition: "background 0.3s",
          }}>
            {saved ? "✓ Saved Securely!" : "Save API Key"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Navigation Grid Overlay ────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", label: "Home", sub: "Buddy Chat", Icon: Ico.Home },
  { id: "chat", label: "Chat", sub: "Social Hub", Icon: Ico.Chat },
  { id: "uploads", label: "Uploads", sub: "Study Files", Icon: Ico.Upload },
  { id: "classroom", label: "Classroom", sub: "Learn with AI", Icon: Ico.Book },
  { id: "schedules", label: "Schedules", sub: "Blossom Sync", Icon: Ico.Calendar },
  { id: "moods", label: "Moods", sub: "Vibe Engine", Icon: Ico.Mood },
  { id: "mascot", label: "Mascots", sub: "3D Gallery", Icon: Ico.Mascot },
];

function NavGrid({ open, onClose, currentPage, mood, onNavigate, onMoodsOpen, onMascotOpen }) {
  const m = MOODS[mood];
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 150,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 500 }}>
        <div style={{
          background: "rgba(255,255,255,0.04)", backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 28, padding: 32,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ color: m.text, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20 }}>
              Navigation
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 36, height: 36, color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico.Close />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {NAV_ITEMS.map(({ id, label, sub, Icon }) => {
              const isActive = currentPage === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    if (id === "moods") { onClose(); onMoodsOpen(); }
                    else if (id === "mascot") { onClose(); onMascotOpen(); }
                    else { onNavigate(id); onClose(); }
                  }}
                  style={{
                    padding: "18px 12px", borderRadius: 18,
                    background: isActive ? m.glass : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isActive ? m.border : "rgba(255,255,255,0.08)"}`,
                    cursor: "pointer", textAlign: "center",
                    boxShadow: isActive ? `0 0 20px ${m.glow}` : "none",
                    transition: "all 0.25s ease", color: isActive ? m.text : "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "scale(1.04)"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "scale(1)"; } }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: isActive ? m.text : "rgba(255,255,255,0.5)" }}>
                    <Icon />
                  </div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13 }}>{label}</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{sub}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Chat bubble ────────────────────────────────────────────────
function ChatBubble({ msg, mood }) {
  const m = MOODS[mood];
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", flexDirection: isUser ? "row-reverse" : "row",
      gap: 10, marginBottom: 14, alignItems: "flex-end",
      animation: "fadeInMsg 0.3s ease",
    }}>
      <style>{`@keyframes fadeInMsg{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {!isUser && <BudMascot mood={mood} size={36} />}
      <div style={{
        maxWidth: "72%", padding: "12px 16px",
        background: isUser
          ? `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`
          : "rgba(255,255,255,0.08)",
        border: isUser ? "none" : `1px solid ${m.border}`,
        borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        color: "#f0f0f0", fontFamily: "'Nunito',sans-serif", fontSize: 14.5, lineHeight: 1.65,
        boxShadow: isUser ? `0 4px 20px ${m.glow}` : "none",
      }}>
        {msg.content}
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────
export default function Main({ user, apiKey: propApiKey }) {
  const [mood, setMood] = useState("calm");
  const [page, setPage] = useState("home");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [moodsOpen, setMoodsOpen] = useState(false);
  const [mascotOpen, setMascotOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(propApiKey || "");
  const [activeMascot, setActiveMascot] = useState("cat");
  const [mascotEmotion, setMascotEmotion] = useState("CALM");
  const [idleCount, setIdleCount] = useState(0);
  const [buddyTyping, setBuddyTyping] = useState(false);
  const idleRef = useRef(null);
  const chatEndRef = useRef(null);

  // Antigravity Daily Cycle Logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) setMood('motivated');
    else if (hour >= 9 && hour < 17) setMood('focused');
    else if (hour >= 17 && hour < 21) setMood('playful');
    else setMood('calm');
  }, []);

  const m = MOODS[mood];

  // Load font
  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
    l.rel = "stylesheet"; document.head.appendChild(l);
  }, []);

  // Initial buddy greeting
  useEffect(() => {
    const delay = setTimeout(() => {
      setBuddyTyping(true);
      setTimeout(() => {
        setBuddyTyping(false);
        setMessages([{
          role: "assistant",
          content: `${m.icon} Hey ${user.nickname}! ${MOODS[mood].dialogue[0]}`,
        }]);
      }, 1400);
    }, 800);
    return () => clearTimeout(delay);
  }, []);

  // Idle detection — Bud speaks first after 25s
  useEffect(() => {
    clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => {
      setIdleCount(c => c + 1);
      setBuddyTyping(true);
      setTimeout(() => {
        setBuddyTyping(false);
        const dialogs = MOODS[mood].dialogue;
        const line = dialogs[idleCount % dialogs.length];
        setMessages(prev => [...prev, { role: "assistant", content: `${m.icon} ${line}` }]);
      }, 1600);
    }, 25000);
    return () => clearTimeout(idleRef.current);
  }, [messages, mood]);

  // Scroll to bottom
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, buddyTyping]);

  // On mood change → Bud announces it
  const handleMoodChange = (newMood) => {
    setMood(newMood);
    const nm = MOODS[newMood];
    setBuddyTyping(true);
    setTimeout(() => {
      setBuddyTyping(false);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `${nm.icon} Switching to ${nm.label} mode — ${nm.desc.split(".")[0]}. ${nm.dialogue[0]}`,
      }]);
    }, 1200);
  };

  // Handle Mascot Interaction (Touch-to-Speak)
  const handleMascotInteract = useCallback(async () => {
    setMascotEmotion("INTERACT");
    const text = `I just poked you! Give me a quick, context-aware greeting based on the current time of day. Keep it to 1 sentence.`;
    handleAISwitch(text, activeMascot);
  }, [activeMascot]);

  // Send message to Multi-Model Brain API
  const handleAISwitch = useCallback(async (userInput = "", selectedMascot = activeMascot) => {
    const text = userInput.trim() || input.trim();
    if (!text || loading || !apiKey) return;

    if (userInput === "") setInput("");

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setBuddyTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          mascotName: selectedMascot,
          apiKey: apiKey,
          systemPrompt: `Your current mood is ${mood} (${m.sub}). Personality: ${m.desc}. The user's name is ${user.nickname}. Keep responses concise and true to the mood personality.`
        })
      });

      const data = await response.json();

      const cleanText = data.text.replace(/\[.*?\]/g, '').trim();

      setBuddyTyping(false);
      setMessages(prev => [...prev, { role: "assistant", content: cleanText }]);
      setMascotEmotion(data.emotion || "CALM");
    } catch (err) {
      setBuddyTyping(false);
      setMessages(prev => [...prev, { role: "assistant", content: "Connection issue — check your API key in Settings! 🔑" }]);
      setMascotEmotion("CONFUSED");
    }
    setLoading(false);
  }, [input, loading, mood, apiKey, user.nickname, activeMascot]);

  const handleNewChat = () => {
    setMessages([]);
    setBuddyTyping(true);
    setTimeout(() => {
      setBuddyTyping(false);
      setMessages([{ role: "assistant", content: `${m.icon} Fresh start! What are we working on, ${user.nickname}?` }]);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: m.bg,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
      transition: "background 0.8s ease",
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: "fixed", width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${m.orb1} 0%, transparent 70%)`,
        top: -300, left: -200, pointerEvents: "none", zIndex: 0,
        transition: "background 0.8s ease",
      }} />
      <div style={{
        position: "fixed", width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${m.orb2} 0%, transparent 70%)`,
        bottom: -200, right: -100, pointerEvents: "none", zIndex: 0,
        transition: "background 0.8s ease",
      }} />
      <Particles mood={mood} />

      {/* ── Top Bar ── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px 0",
      }}>
        {/* Menu */}
        <button
          onClick={() => setNavOpen(true)}
          style={{
            background: m.glass, backdropFilter: "blur(20px)",
            border: `1px solid ${m.border}`, borderRadius: 14,
            padding: "10px 14px", color: m.text, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
          }}
        >
          <Ico.Menu />
          <span style={{ fontWeight: 700, fontSize: 13 }}>Menu</span>
        </button>

        {/* Center logo */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontWeight: 900, fontSize: 20,
            background: `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-0.01em",
          }}>Bud AI</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
            {m.icon} {m.label} Mode
          </div>
        </div>

        {/* Mood quick switch */}
        <button
          onClick={() => setMoodsOpen(true)}
          style={{
            background: m.glass, backdropFilter: "blur(20px)",
            border: `1px solid ${m.border}`, borderRadius: 14,
            padding: "10px 14px", color: m.text, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>{m.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Mood</span>
        </button>
      </div>

      {/* ── Page Title ── */}
      <div style={{ position: "relative", zIndex: 10, padding: "10px 20px 0", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {NAV_ITEMS.find(n => n.id === page)?.label || "Home"} · {user.nickname}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div style={{
        flex: 1, position: "relative", zIndex: 10,
        padding: "16px 20px", overflowY: "auto",
        maxHeight: "calc(100vh - 220px)",
        scrollbarWidth: "none",
      }}>
        {messages.map((msg, i) => <ChatBubble key={i} msg={msg} mood={mood} />)}
        {buddyTyping && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
            <BudMascot mood={mood} size={36} />
            <div style={{
              padding: "12px 18px", background: "rgba(255,255,255,0.08)",
              border: `1px solid ${m.border}`, borderRadius: "20px 20px 20px 4px",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: m.grad[0],
                  animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
              <style>{`@keyframes typingDot{0%,100%{transform:translateY(0);opacity:0.4}50%{transform:translateY(-5px);opacity:1}}`}</style>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div style={{
        position: "relative", zIndex: 10, padding: "0 16px 12px",
      }}>
        <div style={{
          background: m.glass, backdropFilter: "blur(28px)",
          border: `1px solid ${m.border}`, borderRadius: 20,
          padding: "10px 10px 10px 16px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 30px ${m.glow}`,
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleAISwitch()}
            placeholder={`Message Bud... (${m.label} mode)`}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "#f0f0f0", fontFamily: "'Nunito',sans-serif", fontSize: 15,
              placeholder: "rgba(255,255,255,0.3)",
            }}
          />
          <button
            onClick={() => handleAISwitch()}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim()
                ? `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`
                : "rgba(255,255,255,0.1)",
              border: "none", borderRadius: 13, width: 42, height: 42,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() ? "pointer" : "default",
              color: "#fff", transition: "all 0.3s",
              boxShadow: input.trim() ? `0 0 15px ${m.glow}` : "none",
            }}
          >
            <Ico.Send />
          </button>
        </div>
      </div>

      {/* ── Footer Controls ── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", justifyContent: "center", gap: 16,
        padding: "4px 20px 24px",
      }}>
        <button
          onClick={() => setSettingsOpen(true)}
          style={{
            background: m.glass, backdropFilter: "blur(20px)",
            border: `1px solid ${m.border}`, borderRadius: "50%",
            width: 52, height: 52, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: m.text, boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
          }}
          title="Settings & API"
        >
          <Ico.Settings />
        </button>

        <button
          onClick={() => setMascotOpen(true)}
          style={{
            background: `linear-gradient(135deg, ${m.grad[0]}, ${m.grad[1]})`,
            border: "none", borderRadius: "50%",
            width: 60, height: 60, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff",
            boxShadow: `0 0 30px ${m.glow}, 0 6px 20px rgba(0,0,0,0.5)`,
            position: "relative",
          }}
          title="Mascot Gallery"
        >
          <BudMascot mood={mood} size={36} />
        </button>

        {/* 3D Mascot display overlay for the active mascot */}
        <div style={{ position: 'absolute', right: 20, bottom: 90, zIndex: 10, width: 200, height: 200 }}>
          <ThreeMascot
            mascotName={activeMascot}
            isDark={true}
            emotion={mascotEmotion}
            onInteract={handleMascotInteract}
          />
        </div>

        <button
          onClick={handleNewChat}
          style={{
            background: m.glass, backdropFilter: "blur(20px)",
            border: `1px solid ${m.border}`, borderRadius: "50%",
            width: 52, height: 52, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: m.text, boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
          }}
          title="New Chat"
        >
          <Ico.Plus />
        </button>
      </div>

      {/* ── Overlays ── */}
      <NavGrid
        open={navOpen} onClose={() => setNavOpen(false)}
        currentPage={page} mood={mood}
        onNavigate={setPage}
        onMoodsOpen={() => setMoodsOpen(true)}
        onMascotOpen={() => setMascotOpen(true)}
      />
      <MoodsOverlay
        open={moodsOpen} onClose={() => setMoodsOpen(false)}
        currentMood={mood} onSelect={handleMoodChange}
      />
      <MascotCarousel
        open={mascotOpen} onClose={() => setMascotOpen(false)}
        mood={mood} activeMascot={activeMascot} onSelect={setActiveMascot}
      />
      <SettingsModal
        open={settingsOpen} onClose={() => setSettingsOpen(false)}
        mood={mood} apiKey={apiKey} setApiKey={setApiKey}
      />
    </div>
  );
}

