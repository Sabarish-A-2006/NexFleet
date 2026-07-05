import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import StatsCard from "../components/StatsCard.jsx";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ActivitySquare,
  MapPin,
  Activity as LiveIcon,
  Radar,
  Key,
  Wind,
  Power,
  Cpu,
  Crosshair,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function Dashboard() {
  const { stats, triggerImpact, location, liveMode, setLiveMode } = useApp();

  const defaultZone = {
    title: "ALL SYSTEMS NOMINAL",
    status: "ACTIVE SCANS",
    temp: stats.cabinTemperature.toFixed(1) + "°C",
    load: stats.fuelLevel.toFixed(0) + " kW",
  };
  const [activeZone, setActiveZone] = useState(defaultZone);
  const [doorsLocked, setDoorsLocked] = useState(true);
  const [hexStream, setHexStream] = useState("0x00000000");

  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      // Generate a fast random memory address simulation for the LIDAR feed
      const hex1 = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase();
      const hex2 = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase();
      setHexStream(`0x${hex1} : 0x${hex2}`);
    }, 150);
    return () => clearInterval(interval);
  }, [liveMode]);

  return (
    <motion.div
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Main Innovative Interactive Feature Panel */}
      <motion.section
        className="panel dashboard-hero"
        variants={itemVariants}
      >
        {/* Radar & Chassis Interactive Component with 3D Depth */}
        <div className="radar-panel">
          <div className="radar-stage">
            {/* Concentric Distance Rings */}
            <svg width="400" height="400" style={{ position: "absolute" }}>
              <circle
                cx="200"
                cy="200"
                r="160"
                fill="none"
                stroke="rgba(6, 182, 212, 0.4)"
                strokeDasharray="4 6"
                strokeWidth="1"
              />
              <circle
                cx="200"
                cy="200"
                r="100"
                fill="none"
                stroke="rgba(6, 182, 212, 0.2)"
                strokeDasharray="2 4"
                strokeWidth="1"
              />
              <text
                x="200"
                y="32"
                fill="rgba(6,182,212,0.6)"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                style={{ fontFamily: "monospace" }}
              >
                30m RADIUS
              </text>
              <text
                x="200"
                y="92"
                fill="rgba(6,182,212,0.4)"
                fontSize="10"
                textAnchor="middle"
                style={{ fontFamily: "monospace" }}
              >
                15m CQC
              </text>
            </svg>

            {/* Radar Sweep Graphics */}
            <div className="radar-sweep" />

            {/* Targeted Hover Blips */}
            <div
              style={{
                position: "absolute",
                top: 100,
                left: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="blip"
                style={{
                  width: 6,
                  height: 6,
                  background: "#10b981",
                  borderRadius: "50%",
                  boxShadow: "0 0 15px #10b981",
                  animation: "pulse-blip 3s infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 24,
                  height: 24,
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: -60,
                  borderBottom: "1px solid rgba(16, 185, 129, 0.4)",
                  width: 50,
                  height: 1,
                  transform: "rotate(25deg)",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 120,
                right: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="blip"
                style={{
                  width: 8,
                  height: 8,
                  background: "var(--danger)",
                  borderRadius: "50%",
                  boxShadow: "0 0 20px var(--danger)",
                  animation: "pulse-blip 2.5s infinite 1s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 30,
                  height: 30,
                  border: "1px solid rgba(239, 68, 68, 0.6)",
                  borderRadius: "50%",
                }}
              />
              <Crosshair
                size={40}
                color="rgba(239, 68, 68, 0.3)"
                style={{ position: "absolute" }}
              />
            </div>

            {/* Central Cybernetic Car SVG Grid */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                transform: "scale(1.15)",
                filter: "drop-shadow(0 20px 25px rgba(0,0,0,0.1))",
              }}
            >
              <svg
                width="120"
                height="280"
                viewBox="0 0 100 240"
                fill="none"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.4))",
                }}
              >
                <g style={{ cursor: "crosshair" }}>
                  {/* Frame */}
                  <rect
                    x="20"
                    y="10"
                    width="60"
                    height="220"
                    rx="18"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    fill="var(--bg-surface)"
                  />

                  {/* Front Inverter */}
                  <path
                    d="M 20 45 Q 50 25 80 45 L 80 15 Q 50 -5 20 15 Z"
                    fill="rgba(16, 185, 129, 0.25)"
                    stroke="#10b981"
                    onMouseEnter={() =>
                      setActiveZone({
                        title: "FRONT INVERTER MATRIX",
                        status: "SYNCED",
                        temp: "42.1°C",
                        load: "12%",
                      })
                    }
                    onMouseLeave={() => setActiveZone(defaultZone)}
                    style={{ transition: "fill 0.3s" }}
                    onMouseOver={(e) =>
                      (e.target.style.fill = "rgba(16, 185, 129, 0.8)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.fill = "rgba(16, 185, 129, 0.25)")
                    }
                  />
                  <path
                    d="M 25 65 Q 50 50 75 65 L 70 85 L 30 85 Z"
                    fill="rgba(6, 182, 212, 0.6)"
                    stroke="#06b6d4"
                    strokeWidth="1"
                  />

                  {/* Battery Core */}
                  <rect
                    x="25"
                    y="85"
                    width="50"
                    height="85"
                    fill="rgba(245, 158, 11, 0.2)"
                    stroke="#f59e0b"
                    onMouseEnter={() =>
                      setActiveZone({
                        title: "HIGH-VOLTAGE CELL ARRAY",
                        status: "DISCHARGING",
                        temp: "34.2°C",
                        load: stats.fuelLevel.toFixed(1) + " kWh",
                      })
                    }
                    onMouseLeave={() => setActiveZone(defaultZone)}
                    style={{ transition: "fill 0.3s" }}
                    onMouseOver={(e) =>
                      (e.target.style.fill = "rgba(245, 158, 11, 0.6)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.fill = "rgba(245, 158, 11, 0.2)")
                    }
                  />

                  <path
                    d="M 30 170 L 70 170 L 75 185 Q 50 195 25 185 Z"
                    fill="rgba(6, 182, 212, 0.6)"
                    stroke="#06b6d4"
                    strokeWidth="1"
                  />
                  {/* Rear Axle */}
                  <path
                    d="M 20 190 L 80 190 L 75 220 Q 50 235 25 220 Z"
                    fill="rgba(139, 92, 246, 0.25)"
                    stroke="#8b5cf6"
                    onMouseEnter={() =>
                      setActiveZone({
                        title: "REAR AXLE TELEMETRY MODULE",
                        status: "ACTIVE",
                        temp: "38.5°C",
                        load: "45%",
                      })
                    }
                    onMouseLeave={() => setActiveZone(defaultZone)}
                    style={{ transition: "fill 0.3s" }}
                    onMouseOver={(e) =>
                      (e.target.style.fill = "rgba(139, 92, 246, 0.8)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.fill = "rgba(139, 92, 246, 0.25)")
                    }
                  />
                </g>

                {/* Tires */}
                <rect
                  x="6"
                  y="30"
                  width="14"
                  height="35"
                  rx="4"
                  fill="#000"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  onMouseEnter={() =>
                    setActiveZone({
                      title: "FRONT LEFT TIRE",
                      status: "STRUCTURAL OK",
                      psi: stats.tyrePressureFL + " PSI",
                      temp: "26°C",
                    })
                  }
                  onMouseLeave={() => setActiveZone(defaultZone)}
                />
                <rect
                  x="80"
                  y="30"
                  width="14"
                  height="35"
                  rx="4"
                  fill="#000"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  onMouseEnter={() =>
                    setActiveZone({
                      title: "FRONT RIGHT TIRE",
                      status: "STRUCTURAL OK",
                      psi: stats.tyrePressureFR + " PSI",
                      temp: "26°C",
                    })
                  }
                  onMouseLeave={() => setActiveZone(defaultZone)}
                />
                <rect
                  x="6"
                  y="170"
                  width="14"
                  height="35"
                  rx="4"
                  fill="#000"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  onMouseEnter={() =>
                    setActiveZone({
                      title: "REAR LEFT TIRE",
                      status: "STRUCTURAL OK",
                      psi: stats.tyrePressureRL + " PSI",
                      temp: "29°C",
                    })
                  }
                  onMouseLeave={() => setActiveZone(defaultZone)}
                />
                <rect
                  x="80"
                  y="170"
                  width="14"
                  height="35"
                  rx="4"
                  fill="#000"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  onMouseEnter={() =>
                    setActiveZone({
                      title: "REAR RIGHT TIRE",
                      status: "STRUCTURAL OK",
                      psi: stats.tyrePressureRR + " PSI",
                      temp: "29°C",
                    })
                  }
                  onMouseLeave={() => setActiveZone(defaultZone)}
                />
              </svg>
            </div>

            {/* Center Origin Mark */}
            <div
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 0 10px #fff",
              }}
            />
          </div>
        </div>

        {/* Right side Professional Context Details */}
        <div className="dashboard-detail">
          <div className="dashboard-detail-header">
            <div className="flex items-center gap-3">
              <Radar
                size={28}
                color="var(--accent)"
                className="spinning-slow"
              />
              <h2 className="!m-0">
                A.I. Context Matrix
              </h2>
            </div>
            {/* Live Data Stream Indicator */}
            <div className="stream-pill">
              <Cpu size={14} /> STREAM: {hexStream}
            </div>
          </div>

          <div className="matrix-card">
            <div className="matrix-header">
              <div>
                <div className="matrix-eyebrow">
                  TARGET ACQUISITION:
                </div>
                <div className="matrix-title">
                  {activeZone.title}
                </div>
              </div>
              <div className="matrix-status">
                {activeZone.status}
              </div>
            </div>

            <div className="matrix-metrics">
              <div>
                <div className="matrix-label">
                  PRIMARY METRIC
                </div>
                <div className="matrix-value">
                  {activeZone.psi || activeZone.load || "---"}
                </div>
              </div>
              <div>
                <div className="matrix-label">
                  THERMAL SIG
                </div>
                <div className="matrix-value">
                  {activeZone.temp || "N/A"}
                </div>
              </div>
              <div>
                <div className="matrix-label">
                  DATALINK
                </div>
                <div className="matrix-value text-success">
                  SECURE
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatsCard
              title="Energy Dispersal"
              value={stats.fuelLevel.toFixed(0)}
              unit="kW"
              trend="Optimal"
              icon={Power}
            />
            <StatsCard
              title="Cabin Atmosphere"
              value={stats.cabinTemperature.toFixed(1)}
              unit="°C"
              trend="Stable"
              icon={Wind}
            />
          </div>

          <div className="actions mt-auto pt-5">
            <button
              className={`${doorsLocked ? "secondary" : "primary"} flex-1 justify-center`}
              onClick={() => setDoorsLocked(!doorsLocked)}
            >
              <Key size={18} />{" "}
              {doorsLocked ? "CHASSIS LOCKED" : "CHASSIS UNLOCKED"}
            </button>
            <button className="primary flex-1 justify-center">
              <ShieldCheck size={18} /> INITIATE SHIELD
            </button>
          </div>
        </div>
      </motion.section>

      {/* Modernized Telemetry Panel */}
      <motion.section className="panel" variants={itemVariants}>
        <h2>
          <ActivitySquare size={24} color="var(--success)" /> Live Navigation &
          Velocity
        </h2>
        <div className="telemetry-layout">
          <div className="location-card">
            <div className="loc-item">
              <span className="loc-label">Latitude Vector</span>
              <span className="loc-val">
                {location.lat.toFixed(5)}° N
              </span>
            </div>
            <div className="loc-item">
              <span className="loc-label">Longitude Vector</span>
              <span className="loc-val">
                {location.lng.toFixed(5)}° E
              </span>
            </div>
            <div className="loc-item">
              <span className="loc-label">Relative Velocity</span>
              <span className="loc-val text-primary-light">
                {Math.floor(location.speed)}{" "}
                <span className="text-sm text-text-muted">
                  km/h
                </span>
              </span>
            </div>
          </div>

          <div className="telemetry-actions">
            <button
              className={`${liveMode ? "primary" : "secondary"} w-full justify-center`}
              onClick={() => setLiveMode(!liveMode)}
            >
              <LiveIcon size={18} fill={liveMode ? "currentColor" : "none"} />{" "}
              {liveMode ? "Data Stream Active" : "Data Stream Paused"}
            </button>
            <button
              className="danger w-full justify-center"
              onClick={triggerImpact}
            >
              Simulate Physical Impact
            </button>
          </div>
        </div>
      </motion.section>

    </motion.div>
  );
}
