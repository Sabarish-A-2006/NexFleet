import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ShieldAlert,
  Zap,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
  Car,
  Siren
} from "lucide-react";

// ─── Severity Configuration ───────────────────────────────────────────────────
const getSeverity = (g) => {
  if (g > 85) return { label: "CRITICAL CRASH", color: "#ef4444", bg: "rgba(239,68,68,0.15)", ring: "#ef4444" };
  if (g > 50) return { label: "SEVERE IMPACT",  color: "#ef4444", bg: "rgba(239,68,68,0.10)", ring: "#ef4444" };
  if (g > 15) return { label: "MINOR BUMP",     color: "#f59e0b", bg: "rgba(245,158,11,0.10)", ring: "#f59e0b" };
  if (g > 5)  return { label: "LIGHT MOVEMENT", color: "#3b82f6", bg: "rgba(59,130,246,0.10)", ring: "#3b82f6" };
  return       { label: "ALL CLEAR",            color: "#10b981", bg: "rgba(16,185,129,0.10)", ring: "#10b981" };
};

// ─── Top-down car SVG with directional impact arrows ─────────────────────────
function VehicleDiagram({ gx, gy, gz, totalG }) {
  const frontImpact  = gx < -8;
  const rearImpact   = gx > 8;
  const leftImpact   = gy < -8;
  const rightImpact  = gy > 8;
  const vertImpact   = gz > 3;
  const anyImpact    = totalG > 8;

  const arrowStyle = (active, color = "#ef4444") => ({
    opacity: active ? 1 : 0.12,
    transition: "opacity 0.15s, filter 0.15s",
    filter: active ? `drop-shadow(0 0 8px ${color})` : "none",
  });

  return (
    <svg viewBox="0 0 200 300" width="160" height="240" style={{ overflow: "visible" }}>
      {/* ── Directional Arrows ── */}
      {/* Front arrow (top) */}
      <g style={arrowStyle(frontImpact)}>
        <polygon points="100,10 90,35 110,35" fill="#ef4444" />
        <rect x="96" y="35" width="8" height="20" fill="#ef4444" rx="2" />
        <text x="100" y="72" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="700">FRONT</text>
      </g>

      {/* Rear arrow (bottom) */}
      <g style={arrowStyle(rearImpact)}>
        <polygon points="100,290 90,265 110,265" fill="#ef4444" />
        <rect x="96" y="245" width="8" height="20" fill="#ef4444" rx="2" />
        <text x="100" y="242" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="700">REAR</text>
      </g>

      {/* Left arrow */}
      <g style={arrowStyle(leftImpact)}>
        <polygon points="10,155 35,145 35,165" fill="#a78bfa" />
        <rect x="35" y="151" width="20" height="8" fill="#a78bfa" rx="2" />
        <text x="32" y="175" textAnchor="middle" fontSize="9" fill="#a78bfa" fontWeight="700">LEFT</text>
      </g>

      {/* Right arrow */}
      <g style={arrowStyle(rightImpact)}>
        <polygon points="190,155 165,145 165,165" fill="#a78bfa" />
        <rect x="145" y="151" width="20" height="8" fill="#a78bfa" rx="2" />
        <text x="168" y="175" textAnchor="middle" fontSize="9" fill="#a78bfa" fontWeight="700">RIGHT</text>
      </g>

      {/* Vertical bump indicator (center ring pulse) */}
      {vertImpact && (
        <circle cx="100" cy="155" r="48" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
      )}

      {/* ── Car Body Top-View ── */}
      {/* Main body */}
      <rect x="60" y="80" width="80" height="150" rx="18" fill={anyImpact ? "rgba(239,68,68,0.12)" : "rgba(59,130,246,0.08)"} stroke={anyImpact ? "#ef4444" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" />

      {/* Windshield */}
      <rect x="68" y="90" width="64" height="35" rx="6" fill="rgba(147,197,253,0.25)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Rear window */}
      <rect x="68" y="190" width="64" height="30" rx="6" fill="rgba(147,197,253,0.15)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Dashboard line */}
      <line x1="68" y1="132" x2="132" y2="132" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Seat dots */}
      <circle cx="82" cy="150" r="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx="118" cy="150" r="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx="82" cy="172" r="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="118" cy="172" r="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* Wheels */}
      {[{x:54,y:95},{x:138,y:95},{x:54,y:200},{x:138,y:200}].map((w, i) => (
        <rect key={i} x={w.x} y={w.y} width="16" height="28" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      ))}

      {/* G-force center indicator */}
      <circle cx="100" cy="155" r="5" fill={anyImpact ? "#ef4444" : "#10b981"} opacity="0.9">
        {anyImpact && <animate attributeName="r" values="5;8;5" dur="0.6s" repeatCount="indefinite" />}
      </circle>
    </svg>
  );
}

// ─── Axis bar: shows positive / negative G on a center-zero bar ───────────────
function AxisBar({ value, maxG = 10, color, label, sublabel }) {
  const pct = Math.min(100, (Math.abs(value) / maxG) * 100);
  const isNeg = value < 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
        <span style={{ fontWeight: 700, color: "var(--text)" }}>{label}</span>
        <span style={{ fontFamily: "monospace", fontWeight: 800, color }}>
          {value > 0 ? "+" : ""}{value.toFixed(2)} G
        </span>
      </div>
      <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid var(--panel-border)", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* Center line */}
        <div style={{ position: "absolute", left: "50%", width: 1, height: "100%", background: "rgba(255,255,255,0.2)", zIndex: 1 }} />
        {/* Bar fill */}
        <motion.div
          animate={{ width: `${pct / 2}%`, marginLeft: isNeg ? `${50 - pct / 2}%` : "50%" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{ position: "absolute", height: "100%", background: color, borderRadius: isNeg ? "4px 0 0 4px" : "0 4px 4px 0" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--muted)", marginTop: 4, fontWeight: 600 }}>
        {sublabel.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

// ─── SVG Waveform chart ────────────────────────────────────────────────────────
function WaveformChart({ history, maxForce }) {
  const W = 600, H = 130;
  const maxVal = Math.max(10, maxForce * 1.1);

  const path = (key, center = false) => {
    if (!history.length) return "";
    const pts = history.map((d, i) => {
      const x = (i / (history.length - 1)) * W;
      const y = center
        ? H / 2 - (d[key] / maxVal) * (H / 2)
        : H - (d[key] / maxVal) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${pts.join(" L ")}`;
  };

  const area = () => {
    if (!history.length) return "";
    const pts = history.map((d, i) => {
      const x = (i / (history.length - 1)) * W;
      const y = H - (d.total / maxVal) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M 0,${H} L ${pts.join(" L ")} L ${W},${H} Z`;
  };

  return (
    <div style={{ position: "relative", height: H, background: "rgba(0,0,0,0.2)", borderRadius: 12, border: "1px solid var(--panel-border)", overflow: "hidden" }}>
      {[25, 50, 75].map(p => (
        <div key={p} style={{ position: "absolute", top: `${p}%`, width: "100%", height: 1, background: "rgba(255,255,255,0.03)" }} />
      ))}
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area()} fill="url(#areaGrad)" />
        <path d={path("gx", true)} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.7" />
        <path d={path("gy", true)} fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.7" />
        <path d={path("gz")} fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.7" />
        <path d={path("total")} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CrashMeter() {
  const { triggerImpact, crashActive, crashStage, crashCountdown } = useApp();

  const [gx, setGx] = useState(0);
  const [gy, setGy] = useState(0);
  const [gz, setGz] = useState(1.0);
  const [maxForce, setMaxForce] = useState(1.0);
  const [activeScenario, setActiveScenario] = useState("driving");
  const [airbagDeployed, setAirbagDeployed] = useState(false);
  const [impactDirection, setImpactDirection] = useState("None");
  const [deltaV, setDeltaV] = useState(0);
  const [energyAbsorbed, setEnergyAbsorbed] = useState(0);

  const timeRef = useRef(0);
  const collisionRef = useRef(null);

  const [history, setHistory] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({ time: i, total: 1.0, gx: 0, gy: 0, gz: 1.0 }))
  );

  useEffect(() => {
    if (!crashActive) {
      setAirbagDeployed(false);
      if (activeScenario === "severe" || activeScenario === "side") {
        setActiveScenario("driving");
        setImpactDirection("None");
        setDeltaV(0);
        setEnergyAbsorbed(0);
      }
    }
  }, [crashActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current += 1;
      const t = timeRef.current;
      const now = Date.now();
      const noise = () => (Math.random() - 0.5) * 0.08;

      let nextGx = 0, nextGy = 0, nextGz = 1.0;

      if (collisionRef.current) {
        const col = collisionRef.current;
        const elapsed = (now - col.startTime) / 1000;
        if (elapsed >= col.duration) {
          collisionRef.current = null;
          setActiveScenario("driving");
        } else {
          const decay = Math.exp(-col.beta * elapsed) * Math.cos(col.omega * elapsed);
          const g = col.peak * decay;
          if (col.axis === "x") { nextGx = g + noise(); nextGy = noise() * 3; nextGz = 1.0 + Math.abs(g) * 0.05 + noise(); }
          else if (col.axis === "y") { nextGx = noise() * 3; nextGy = g + noise(); nextGz = 1.0 + Math.abs(g) * 0.03 + noise(); }
          else { nextGx = noise(); nextGy = noise(); nextGz = 1.0 + g + noise(); }
        }
      } else {
        switch (activeScenario) {
          case "parking":
            nextGx = noise() * 0.15; nextGy = noise() * 0.15; nextGz = 1.0 + noise() * 0.01;
            break;
          default:
            nextGx = Math.sin(t / 12) * 0.25 + Math.sin(t / 4) * 0.05 + noise();
            nextGy = Math.cos(t / 16) * 0.35 + Math.sin(t / 6) * 0.08 + noise();
            nextGz = 1.0 + Math.sin(t / 3) * 0.06 + (Math.random() - 0.5) * 0.1;
        }
      }

      const total = Math.sqrt(nextGx ** 2 + nextGy ** 2 + nextGz ** 2);
      setGx(nextGx); setGy(nextGy); setGz(nextGz);
      setMaxForce(prev => Math.max(prev, total));
      setHistory(prev => [...prev.slice(1), { time: t, total, gx: nextGx, gy: nextGy, gz: nextGz }]);
    }, 50);

    return () => clearInterval(interval);
  }, [activeScenario]);

  const triggerSimulation = (type) => {
    const now = Date.now();
    setActiveScenario(type);
    const configs = {
      bump:   { axis: "z", peak: 3.8,  duration: 0.6, beta: 6.0, omega: 30, dir: "Vertical (Road Bump)", dv: 2,  energy: 0.8 },
      minor:  { axis: "x", peak: 18,   duration: 1.0, beta: 4.5, omega: 20, dir: "Frontal (Curb Strike)", dv: 8,  energy: 12.5 },
      side:   { axis: "y", peak: -52,  duration: 1.4, beta: 3.2, omega: 15, dir: "Right Side (T-Bone)",  dv: 32, energy: 148 },
      severe: { axis: "x", peak: -92,  duration: 1.6, beta: 2.8, omega: 12, dir: "Head-On Frontal",      dv: 64, energy: 412 },
    };
    const cfg = configs[type];
    if (!cfg) return;
    collisionRef.current = { axis: cfg.axis, peak: cfg.peak, startTime: now, duration: cfg.duration, beta: cfg.beta, omega: cfg.omega };
    setImpactDirection(cfg.dir);
    setDeltaV(cfg.dv);
    setEnergyAbsorbed(cfg.energy);
    if (type === "side" || type === "severe") {
      if (type === "severe") setAirbagDeployed(true);
      setTimeout(() => triggerImpact(), 300);
    }
  };

  const totalG = Math.sqrt(gx ** 2 + gy ** 2 + gz ** 2);
  const sev = getSeverity(totalG);
  const airbagProb = totalG > 35 ? 99.8 : totalG > 15 ? 12.4 : 0;

  // ─── PRESETS ───────────────────────────────────────────────────────────────
  const presets = [
    { id: "parking", label: "🅿️  Parked",          sub: "~1G vertical only",     color: "var(--muted)" },
    { id: "driving", label: "🛣️  Highway Driving",  sub: "Normal road vibrations", color: "var(--accent)" },
    { id: "bump",    label: "🚧  Pothole",           sub: "3.8G vertical spike",    color: "#f59e0b" },
    { id: "minor",   label: "🚗  Fender Bender",     sub: "18G frontal bump",       color: "#f97316" },
    { id: "side",    label: "💥  T-Bone Collision",  sub: "52G right-side impact",  color: "#ef4444" },
    { id: "severe",  label: "🚨  Frontal Crash",     sub: "92G — Airbags Deploy",   color: "#dc2626" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 20, fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Emergency Banner ── */}
      <AnimatePresence>
        {crashActive && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{ padding: "14px 20px", background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", borderRadius: 14, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 30px rgba(239,68,68,0.2)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <motion.div animate={{ scale: [1,1.2,1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ background: "#ef4444", padding: 8, borderRadius: 10, color: "#fff", display: "flex" }}>
                <Siren size={20} />
              </motion.div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>🚨 CRASH PROTOCOL ACTIVE — STAGE: {crashStage}</div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
                  Emergency services will be dispatched in <strong style={{ color: "#ef4444" }}>{crashCountdown} seconds</strong> unless cancelled.
                </div>
              </div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 900, color: "#ef4444" }}>
              {String(Math.floor((crashCountdown || 0) / 60)).padStart(2,"0")}:{String((crashCountdown || 0) % 60).padStart(2,"0")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <Car size={26} color="var(--accent)" /> Crash Impact Monitor
          </h1>
          <p style={{ color: "var(--muted)", margin: "4px 0 0", fontSize: 14 }}>
            Real-time 3-axis accelerometer · Impact direction detection · Emergency analytics
          </p>
        </div>
        <button onClick={() => setMaxForce(1.0)} style={{ background: "var(--panel-light)", border: "1px solid var(--panel-border)", padding: "9px 14px", borderRadius: 10, color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontWeight: 600, fontSize: 13 }}>
          <RotateCcw size={14} /> Reset Peak G
        </button>
      </div>

      {/* ── Preset Selector ── */}
      <div style={{ background: "var(--panel-light)", border: "1px solid var(--panel-border)", borderRadius: 16, padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 12, textTransform: "uppercase" }}>
          Simulate a driving scenario:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {presets.map(p => {
            const isSel = activeScenario === p.id;
            return (
              <button key={p.id} onClick={() => {
                if (p.id === "parking" || p.id === "driving") setActiveScenario(p.id);
                else triggerSimulation(p.id);
              }}
              disabled={crashActive && p.id !== "parking" && p.id !== "driving"}
              style={{
                background: isSel ? "rgba(255,255,255,0.06)" : "transparent",
                border: `1.5px solid ${isSel ? p.color : "var(--panel-border)"}`,
                borderRadius: 12, padding: "10px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.2s"
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isSel ? p.color : "var(--text)" }}>{p.label}</div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>{p.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main 3-Column Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px 1fr", gap: 20, alignItems: "start" }}>

        {/* ── LEFT: Big G Meter + waveform ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Status Card */}
          <motion.div
            animate={{ borderColor: sev.ring, background: sev.bg }}
            transition={{ duration: 0.3 }}
            style={{ border: `1.5px solid ${sev.ring}`, borderRadius: 20, padding: "24px 28px", boxShadow: "var(--shadow)" }}
          >
            {/* Big G number */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <motion.div
                animate={{ color: sev.color }}
                style={{ fontSize: 80, fontWeight: 900, lineHeight: 1, fontFamily: "monospace" }}
              >
                {totalG.toFixed(1)}
              </motion.div>
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>
                G-FORCE (TOTAL MAGNITUDE)
              </div>
              <motion.div
                animate={{ background: sev.color }}
                style={{ display: "inline-block", marginTop: 12, padding: "6px 18px", borderRadius: 20, color: "#fff", fontWeight: 800, fontSize: 13 }}
              >
                {sev.label}
              </motion.div>
            </div>

            {/* Progress bar: 0 → 100 G scale */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", fontWeight: 700, marginBottom: 6 }}>
                <span>0 G — Stationary</span>
                <span>15 G — Alert</span>
                <span>50 G — Severe</span>
                <span>100 G</span>
              </div>
              <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid var(--panel-border)", overflow: "hidden", position: "relative" }}>
                {/* Zone colors */}
                <div style={{ position: "absolute", left: 0, width: "15%", height: "100%", background: "rgba(16,185,129,0.25)" }} />
                <div style={{ position: "absolute", left: "15%", width: "35%", height: "100%", background: "rgba(245,158,11,0.15)" }} />
                <div style={{ position: "absolute", left: "50%", width: "35%", height: "100%", background: "rgba(239,68,68,0.15)" }} />
                <div style={{ position: "absolute", left: "85%", width: "15%", height: "100%", background: "rgba(220,38,38,0.30)" }} />
                {/* Indicator */}
                <motion.div
                  animate={{ width: `${Math.min(100, (totalG / 100) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 18 }}
                  style={{ height: "100%", background: sev.color, borderRadius: 7, boxShadow: `0 0 12px ${sev.color}` }}
                />
              </div>
            </div>

            {/* Peak / Threshold row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--panel-border)", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, letterSpacing: 0.5 }}>PEAK G RECORDED</div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 2 }}>{maxForce.toFixed(1)} G</div>
              </div>
              <div style={{ background: "rgba(239,68,68,0.06)", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, letterSpacing: 0.5 }}>SOS TRIGGER POINT</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#ef4444", marginTop: 2 }}>85.0 G</div>
              </div>
            </div>
          </motion.div>

          {/* Waveform Graph */}
          <div style={{ background: "var(--panel-light)", border: "1px solid var(--panel-border)", borderRadius: 20, padding: 20, boxShadow: "var(--shadow)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={16} color="var(--accent)" />
                <span style={{ fontWeight: 800, fontSize: 13 }}>LIVE WAVEFORM</span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>— last 2.5 seconds</span>
              </div>
              <div style={{ display: "flex", gap: 10, fontSize: 11, fontWeight: 700 }}>
                {[["#3b82f6","Total G"],["#ef4444","Front/Back (Gx)"],["#a78bfa","Left/Right (Gy)"],["#10b981","Vertical (Gz)"]].map(([c,l])=>(
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, color: c }}>
                    <span style={{ width: 10, height: 2, background: c, display: "inline-block", borderRadius: 1 }} /> {l}
                  </span>
                ))}
              </div>
            </div>
            <WaveformChart history={history} maxForce={maxForce} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>
              <span>← PAST</span><span>STREAMING LIVE AT 20 SAMPLES/SEC</span><span>NOW →</span>
            </div>
          </div>
        </div>

        {/* ── CENTER: Vehicle Diagram ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <div style={{ background: "var(--panel-light)", border: "1px solid var(--panel-border)", borderRadius: 20, padding: "20px 14px", boxShadow: "var(--shadow)", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: 0.5, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
              <Car size={15} color="var(--accent)" /> Impact Direction
            </div>
            <VehicleDiagram gx={gx} gy={gy} gz={gz} totalG={totalG} />
            <div style={{ textAlign: "center", paddingTop: 4 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Force Vector</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: totalG > 8 ? "#ef4444" : "var(--success)" }}>
                {impactDirection}
              </div>
            </div>
          </div>

          {/* Quick stats column */}
          <div style={{ background: "var(--panel-light)", border: "1px solid var(--panel-border)", borderRadius: 20, padding: 16, boxShadow: "var(--shadow)", width: "100%" }}>
            <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12, color: "var(--muted)" }}>Axis Readings</div>
            {[
              { label: "Gx", desc: "Front↔Back", val: gx, color: "#ef4444" },
              { label: "Gy", desc: "Left↔Right", val: gy, color: "#a78bfa" },
              { label: "Gz", desc: "Vertical",   val: gz, color: "#10b981" },
            ].map(ax => (
              <div key={ax.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--panel-border)" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: ax.color }}>{ax.label}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 6 }}>{ax.desc}</span>
                </div>
                <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13 }}>
                  {ax.val > 0 ? "+" : ""}{ax.val.toFixed(2)} G
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Axis Bars + Diagnostics ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Axis Force Bars */}
          <div style={{ background: "var(--panel-light)", border: "1px solid var(--panel-border)", borderRadius: 20, padding: 22, boxShadow: "var(--shadow)" }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={15} color="var(--accent)" /> HOW HARD IS THE CAR BEING PUSHED?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <AxisBar
                value={gx} maxG={20} color="#ef4444" label="Front / Back Force (Gx)"
                sublabel={["← Hard Braking / Rear Hit", "Acceleration / Front Hit →"]}
              />
              <AxisBar
                value={gy} maxG={20} color="#a78bfa" label="Left / Right Force (Gy)"
                sublabel={["← Left Turn / Right Impact", "Right Turn / Left Impact →"]}
              />
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>Vertical Force (Gz)</span>
                  <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#10b981" }}>{gz.toFixed(2)} G</span>
                </div>
                <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid var(--panel-border)", overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", left: "25%", width: 1, height: "100%", background: "rgba(255,255,255,0.25)" }} title="1G = Normal gravity" />
                  <motion.div animate={{ width: `${Math.min(100, (gz / 4) * 100)}%` }} style={{ height: "100%", background: gz > 2.5 ? "#f59e0b" : "#10b981", borderRadius: 6 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--muted)", marginTop: 4, fontWeight: 600 }}>
                  <span>0 G (Airborne)</span><span>↑ 1G = Normal Gravity</span><span>4G (Heavy Bump)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Diagnostics Card */}
          <div style={{ background: "var(--panel-light)", border: "1px solid var(--panel-border)", borderRadius: 20, padding: 22, boxShadow: "var(--shadow)" }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={15} color="var(--accent)" /> IMPACT ANALYTICS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  icon: airbagDeployed ? "💥" : "✅",
                  label: "Airbag System",
                  value: airbagDeployed ? "DEPLOYED" : "Armed & Ready",
                  color: airbagDeployed ? "#ef4444" : "#10b981"
                },
                {
                  icon: "🧭",
                  label: "Impact Direction",
                  value: impactDirection,
                  color: totalG > 15 ? "#f59e0b" : "var(--text)"
                },
                {
                  icon: "⚡",
                  label: "Speed Change (ΔV)",
                  value: deltaV > 0 ? `${deltaV} km/h` : "—",
                  color: deltaV > 30 ? "#ef4444" : "var(--text)"
                },
                {
                  icon: "🔋",
                  label: "Energy Absorbed",
                  value: energyAbsorbed > 0 ? `${energyAbsorbed.toFixed(0)} kJ` : "—",
                  color: energyAbsorbed > 100 ? "#ef4444" : "var(--text)"
                },
                {
                  icon: "🎯",
                  label: "Airbag Deploy Chance",
                  value: airbagProb > 0 ? `${airbagProb}%` : "0%",
                  color: airbagProb > 50 ? "#ef4444" : "var(--text)"
                },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--panel-border)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 13 }}>
                    <span style={{ fontSize: 16 }}>{row.icon}</span>
                    {row.label}
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 13, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety reminder */}
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <AlertTriangle size={16} color="#ef4444" style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--text)" }}>E-Call threshold: 85G</strong><br />
              Forces exceeding this automatically trigger emergency dispatch to the nearest police station and hospital using GPS coordinates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
