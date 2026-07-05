import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldAlert, Zap, Thermometer } from "lucide-react";

export default function CrashMeter() {
  const { triggerImpact, crashActive } = useApp();
  const [force, setForce] = useState(0);
  const [maxForce, setMaxForce] = useState(0);
  const [autoSimulate, setAutoSimulate] = useState(true);

  const [history, setHistory] = useState(Array(40).fill(0));

  useEffect(() => {
    if (!autoSimulate || crashActive) return;

    const interval = setInterval(() => {
      // Small fluctuations normally
      const variation = (Math.random() - 0.5) * 5;
      const newForce = Math.max(0, Math.min(100, (force || 20) + variation));
      setForce(newForce);
      if (newForce > maxForce) setMaxForce(newForce);

      // Update history
      setHistory((prev) => [...prev.slice(1), newForce]);
    }, 100);

    return () => clearInterval(interval);
  }, [autoSimulate, force, maxForce, crashActive]);

  const handleImpactSimulation = () => {
    setForce(95);
    setMaxForce(95);
    setHistory((prev) => [...prev.slice(1), 95]);
    setAutoSimulate(false);

    // Slight delay before trigger to see the spike
    setTimeout(() => {
      triggerImpact();
    }, 500);
  };

  return (
    <div
      className="page-container"
      style={{ maxWidth: 1000, margin: "0 auto", padding: 40 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              margin: 0,
              color: "var(--text)",
            }}
          >
            Crash Force Analysis
          </h1>
          <p style={{ color: "var(--muted)", margin: "8px 0 0 0" }}>
            Real-time telemetry and impact force monitoring
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setAutoSimulate(!autoSimulate)}
            style={{
              background: autoSimulate
                ? "var(--success-bg)"
                : "var(--panel-light)",
              border: `1px solid ${autoSimulate ? "var(--success)" : "var(--panel-border)"}`,
              padding: "10px 20px",
              borderRadius: 12,
              color: autoSimulate ? "var(--success)" : "var(--text)",
              cursor: "pointer",
            }}
          >
            {autoSimulate ? "Monitoring Active" : "Start Monitoring"}
          </button>
          <button
            onClick={handleImpactSimulation}
            disabled={crashActive}
            style={{
              background: "var(--danger)",
              border: "none",
              padding: "10px 24px",
              borderRadius: 12,
              color: "#fff",
              fontWeight: 700,
              cursor: crashActive ? "not-allowed" : "pointer",
              opacity: crashActive ? 0.5 : 1,
            }}
          >
            Simulate Impact
          </button>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 32 }}
      >
        {/* Main Meter */}
        <div
          style={{
            background: "var(--panel-light)",
            border: "1px solid var(--panel-border)",
            borderRadius: 24,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            minHeight: 450,
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Background Ring */}
          <svg width="300" height="300" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--panel-border)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={
                force > 80
                  ? "var(--danger)"
                  : force > 50
                    ? "var(--warning)"
                    : "var(--accent)"
              }
              strokeWidth="8"
              strokeDasharray="283"
              animate={{ strokeDashoffset: 283 - 283 * (force / 100) }}
              style={{ rotate: -90, transformOrigin: "center" }}
            />
          </svg>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              marginTop: -40,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: force > 80 ? "var(--danger)" : "var(--text)",
                transition: "color 0.3s",
              }}
            >
              {force.toFixed(1)}
            </div>
            <div
              style={{
                color: "var(--muted)",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 2,
              }}
            >
              FORCE G
            </div>
          </div>

          <div style={{ marginTop: "auto", width: "100%", maxWidth: 400 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                color: "var(--muted)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span>INTENSITY RECOVERY</span>
              <span>{force > 80 ? "CRITICAL" : "OPTIMAL"}</span>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--panel-border)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ width: `${force}%` }}
                style={{
                  height: "100%",
                  background: force > 80 ? "var(--danger)" : "var(--accent)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              background: "var(--panel-light)",
              border: "1px solid var(--panel-border)",
              borderRadius: 20,
              padding: 24,
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "var(--warning)",
                marginBottom: 16,
              }}
            >
              <ShieldAlert size={20} />
              <span style={{ fontWeight: 700 }}>MAX IMPACT DETECTED</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>
              {maxForce.toFixed(1)} G
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
              Peak force since system start
            </div>
          </div>

          <div
            style={{
              background: "var(--panel-light)",
              border: "1px solid var(--panel-border)",
              borderRadius: 20,
              padding: 24,
              flex: 1,
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "var(--accent)",
                marginBottom: 24,
              }}
            >
              <Activity size={20} />
              <span style={{ fontWeight: 700 }}>TELEMETRY FEED (LIVE)</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
                height: 160,
                paddingBottom: 10,
                borderBottom: "1px solid var(--panel-border)",
              }}
            >
              {history.map((val, idx) => (
                <motion.div
                  key={idx}
                  animate={{ height: `${val}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    flex: 1,
                    background:
                      val > 80
                        ? "var(--danger)"
                        : val > 50
                          ? "var(--warning)"
                          : "var(--accent)",
                    borderRadius: "2px 2px 0 0",
                    opacity: 0.3 + (idx / history.length) * 0.7,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
                color: "var(--muted)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              <span>-4 SEC</span>
              <span>STREAMING DATA</span>
              <span>NOW</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 32,
          padding: 24,
          background: "var(--danger-bg)",
          border: "1px solid var(--panel-border)",
          borderRadius: 16,
          display: "flex",
          gap: 20,
          alignItems: "center",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            background: "var(--danger)",
            width: 40,
            height: 40,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Zap size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "var(--text)" }}>
            Crash Protocol Threshold: 85 G
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            Force exceeding this limit will automatically initiate E-Call and
            emergency dispatch.
          </div>
        </div>
      </div>
    </div>
  );
}
