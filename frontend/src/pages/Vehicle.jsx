import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Thermometer, Fuel, Wrench, CircleGauge, Radio,
  Wifi, Bluetooth, MapPin, Zap, AlertTriangle, CheckCircle,
  TrendingUp, TrendingDown, Battery, Activity, RefreshCw,
  Shield, BarChart3, Gauge
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const TYRE_OPTIMAL = { min: 32, max: 36 };         // PSI
const FUEL_WARN    = 20;                             // %
const FUEL_LOW     = 10;                             // %
const TEMP_OPTIMAL = { min: 20, max: 25 };          // °C
const TEMP_WARN    = 27;

// ─── Health scoring helpers ────────────────────────────────────────────────────
const tyrePsiStatus = (psi) => {
  if (psi < 28 || psi > 38) return { label: 'Critical',   color: '#ef4444', score: 0   };
  if (psi < 30 || psi > 36) return { label: 'Low/High',   color: '#f59e0b', score: 50  };
  if (psi >= 32 && psi <= 34) return { label: 'Optimal',  color: '#10b981', score: 100 };
  return                          { label: 'Good',         color: '#3b82f6', score: 80  };
};

const fuelStatus = (pct) => {
  if (pct <= FUEL_LOW)  return { label: 'Critically Low', color: '#ef4444', emoji: '🔴' };
  if (pct <= FUEL_WARN) return { label: 'Low',            color: '#f59e0b', emoji: '🟡' };
  if (pct >= 70)        return { label: 'Full',           color: '#10b981', emoji: '🟢' };
  return                       { label: 'Normal',          color: '#3b82f6', emoji: '🔵' };
};

const tempStatus = (t) => {
  if (t > TEMP_WARN)    return { label: 'Warm',    color: '#f97316' };
  if (t < 18)           return { label: 'Cold',    color: '#3b82f6' };
  if (t >= 20 && t <= 25) return { label: 'Ideal', color: '#10b981' };
  return                         { label: 'Normal', color: '#10b981' };
};

// Overall health score (0-100)
const calcHealthScore = (stats) => {
  const tyreScores  = [stats.tyrePressureFL, stats.tyrePressureFR, stats.tyrePressureRL, stats.tyrePressureRR]
    .map(psi => tyrePsiStatus(psi).score);
  const avgTyre     = tyreScores.reduce((a, b) => a + b, 0) / 4;
  const fuelScore   = stats.fuelLevel > FUEL_WARN ? 100 : stats.fuelLevel > FUEL_LOW ? 60 : 20;
  const tempScore   = (stats.cabinTemperature >= 18 && stats.cabinTemperature <= 27) ? 100 : 60;
  return Math.round((avgTyre * 0.5) + (fuelScore * 0.3) + (tempScore * 0.2));
};

// ─── Reusable Components ──────────────────────────────────────────────────────

// Circular gauge with animated fill
function CircularGauge({ value, max = 100, size = 100, strokeWidth = 8, color = '#3b82f6', label, unit, children }) {
  const r    = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(1, Math.max(0, value / max));
  const dash = pct * circ;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        {children || (
          <>
            <div style={{ fontSize: size * 0.2, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: size * 0.1, color: 'var(--muted)', fontWeight: 600 }}>{unit}</div>
          </>
        )}
      </div>
    </div>
  );
}

// Tyre visual (top-down wheel)
function TyreCard({ label, psi, position }) {
  const st = tyrePsiStatus(psi);
  const fill = Math.min(100, Math.max(0, ((psi - 28) / (38 - 28)) * 100));
  const posEmoji = { FL: '↖️', FR: '↗️', RL: '↙️', RR: '↘️' }[position] || '⬤';

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      style={{
        background: 'var(--panel-light)', border: `1.5px solid ${st.color}44`,
        borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: `0 4px 20px ${st.color}15`, position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {posEmoji} {label}
        </span>
        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800, background: `${st.color}20`, color: st.color, border: `1px solid ${st.color}44` }}>
          {st.label}
        </span>
      </div>

      {/* PSI value */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        <motion.span
          key={psi.toFixed(1)}
          animate={{ color: st.color }}
          style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, fontFamily: 'monospace' }}
        >
          {psi.toFixed(1)}
        </motion.span>
        <span style={{ color: 'var(--muted)', marginBottom: 3, fontSize: 13 }}>PSI</span>
      </div>

      {/* Pressure fill bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--muted)', marginBottom: 4, fontWeight: 700 }}>
          <span>28 PSI</span><span>OPTIMAL 32–34</span><span>38 PSI</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
          {/* Optimal zone highlight */}
          <div style={{ position: 'relative', height: '100%' }}>
            <div style={{ position: 'absolute', left: '40%', width: '20%', height: '100%', background: 'rgba(16,185,129,0.2)' }} />
            <motion.div
              animate={{ width: `${fill}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ height: '100%', background: st.color, borderRadius: 3 }}
            />
          </div>
        </div>
      </div>

      {/* Optimal range note */}
      <div style={{ fontSize: 10, color: 'var(--muted)' }}>
        Optimal: {TYRE_OPTIMAL.min}–{TYRE_OPTIMAL.max} PSI
      </div>
    </motion.div>
  );
}

// Mini sparkline using SVG path
function Sparkline({ data, color, height = 40 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 120, H = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `M 0,${H} L ${pts.join(' L ')} L ${W},${H} Z`;
  const line = `M ${pts.join(' L ')}`;
  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#','')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Connection pill
function ConnPill({ icon: Icon, label, connected, ping }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
      background: connected ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
      border: `1px solid ${connected ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
      borderRadius: 10
    }}>
      <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}
        style={{ width: 6, height: 6, borderRadius: '50%', background: connected ? '#10b981' : '#ef4444', display: 'inline-block', flexShrink: 0 }} />
      <Icon size={14} color={connected ? '#10b981' : '#ef4444'} />
      <span style={{ fontSize: 12, fontWeight: 700, color: connected ? '#10b981' : '#ef4444' }}>{label}</span>
      {ping !== undefined && <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginLeft: 2 }}>{ping}ms</span>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Vehicle() {
  const { stats, vehicleId, liveMode, wifiConnected, bluetoothConnected, gpsEnabled, location, performService } = useApp();

  const serviceKmLeft  = Math.max(0, stats.serviceDueKm - stats.mileageKm);
  const healthScore    = calcHealthScore(stats);
  const fuelSt         = fuelStatus(stats.fuelLevel);
  const tempSt         = tempStatus(stats.cabinTemperature);

  // History buffers for sparklines (last 20 ticks at 5s = ~100s of data)
  const historyRef = useRef({ fuel: [], temp: [], speed: [], health: [] });
  const [histSnap, setHistSnap] = useState({ fuel: [], temp: [], speed: [], health: [] });

  useEffect(() => {
    const h = historyRef.current;
    h.fuel   = [...h.fuel.slice(-19),   stats.fuelLevel];
    h.temp   = [...h.temp.slice(-19),   stats.cabinTemperature];
    h.speed  = [...h.speed.slice(-19),  location?.speed || 0];
    h.health = [...h.health.slice(-19), calcHealthScore(stats)];
    setHistSnap({ ...h });
  }, [stats]);

  // Health score color
  const healthColor = healthScore >= 80 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#ef4444';
  const healthLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Fair' : 'Poor';

  // Service urgency
  const serviceUrgent = serviceKmLeft < 1000;
  const serviceColor  = serviceKmLeft < 500 ? '#ef4444' : serviceKmLeft < 1000 ? '#f59e0b' : '#10b981';

  // Estimated fuel range (assume 12km/L, 60L tank)
  const estimatedRangeKm = Math.round((stats.fuelLevel / 100) * 60 * 12);

  // Tyre pressure average
  const tyreAvg = ((stats.tyrePressureFL + stats.tyrePressureFR + stats.tyrePressureRL + stats.tyrePressureRR) / 4);

  // Last updated
  const [lastUpdated, setLastUpdated] = useState(new Date());
  useEffect(() => { setLastUpdated(new Date()); }, [stats]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Car size={26} color="var(--accent)" /> Vehicle Health Status
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: 13 }}>
            Vehicle #{vehicleId} · KA-01-AB-1234 · Tesla Model 3 (2023) ·{' '}
            <span style={{ color: liveMode ? '#10b981' : '#ef4444' }}>
              {liveMode ? '● Live telemetry' : '● Offline'}
            </span>
          </p>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={11} style={{ animation: liveMode ? 'spin 3s linear infinite' : 'none' }} />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <div style={{ marginTop: 2 }}>Updates every 5 seconds</div>
        </div>
      </div>

      {/* ── Row 1: Health Score + Connection + Quick Stats ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18 }}>

        {/* Overall Health Score */}
        <div style={{
          background: 'var(--panel-light)', border: `1.5px solid ${healthColor}44`, borderRadius: 20,
          padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          boxShadow: `0 4px 24px ${healthColor}18`
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Overall Health
          </div>
          <CircularGauge value={healthScore} max={100} size={110} strokeWidth={9} color={healthColor}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: healthColor, lineHeight: 1 }}>{healthScore}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>/ 100</div>
            </div>
          </CircularGauge>
          <div style={{ padding: '4px 14px', borderRadius: 999, background: `${healthColor}20`, color: healthColor, fontWeight: 800, fontSize: 13, border: `1px solid ${healthColor}44` }}>
            {healthLabel}
          </div>
          <Sparkline data={histSnap.health} color={healthColor} height={32} />
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>Health trend (last 100s)</div>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>

          {/* Fuel */}
          <motion.div whileHover={{ y: -2 }} style={{
            background: 'var(--panel-light)', border: `1.5px solid ${fuelSt.color}44`, borderRadius: 18,
            padding: 18, display: 'flex', flexDirection: 'column', gap: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Fuel Level</span>
              <Fuel size={16} color={fuelSt.color} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: fuelSt.color, lineHeight: 1 }}>
              {stats.fuelLevel.toFixed(0)}<span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 600 }}>%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${stats.fuelLevel}%` }} transition={{ duration: 0.6 }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${fuelSt.color}, ${fuelSt.color}aa)`, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
              <span>{fuelSt.emoji} {fuelSt.label}</span>
              <span>~{estimatedRangeKm} km range</span>
            </div>
            <Sparkline data={histSnap.fuel} color={fuelSt.color} height={28} />
          </motion.div>

          {/* Speed */}
          <motion.div whileHover={{ y: -2 }} style={{
            background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 18,
            padding: 18, display: 'flex', flexDirection: 'column', gap: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Current Speed</span>
              <Gauge size={16} color="var(--accent)" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>
              {(location?.speed || 0).toFixed(0)}<span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 600 }}>km/h</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${Math.min(100, (location?.speed || 0) / 120 * 100)}%` }} transition={{ duration: 0.5 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
              <span>0</span><span>60 km/h</span><span>120+</span>
            </div>
            <Sparkline data={histSnap.speed} color="#3b82f6" height={28} />
          </motion.div>

          {/* Odometer */}
          <motion.div whileHover={{ y: -2 }} style={{
            background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 18,
            padding: 18, display: 'flex', flexDirection: 'column', gap: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Odometer</span>
              <CircleGauge size={16} color="var(--accent)" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
              {stats.mileageKm.toFixed(0).toLocaleString()}<span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}> km</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (stats.mileageKm / stats.serviceDueKm) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Next service: {serviceKmLeft.toFixed(0)} km</span>
              <span style={{ color: serviceColor }}>{serviceUrgent ? '⚠️ Due Soon' : '✅ OK'}</span>
            </div>
          </motion.div>

          {/* Cabin Temp */}
          <motion.div whileHover={{ y: -2 }} style={{
            background: 'var(--panel-light)', border: `1.5px solid ${tempSt.color}44`, borderRadius: 18,
            padding: 18, display: 'flex', flexDirection: 'column', gap: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Cabin Temp</span>
              <Thermometer size={16} color={tempSt.color} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: tempSt.color, lineHeight: 1 }}>
              {stats.cabinTemperature.toFixed(1)}<span style={{ fontSize: 18, fontWeight: 600 }}>°C</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${Math.min(100, ((stats.cabinTemperature - 15) / 20) * 100)}%` }} transition={{ duration: 0.6 }}
                style={{ height: '100%', background: `linear-gradient(90deg, #3b82f6, ${tempSt.color})`, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>15°C</span><span style={{ color: tempSt.color }}>{tempSt.label}</span><span>35°C</span>
            </div>
            <Sparkline data={histSnap.temp} color={tempSt.color} height={28} />
          </motion.div>

          {/* Seat Condition */}
          <motion.div whileHover={{ y: -2 }} style={{
            background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 18, padding: 18,
            display: 'flex', flexDirection: 'column', gap: 8
          }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Cabin Comfort</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 28 }}>💺</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{stats.seatCondition}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Seat Condition</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>{stats.cleanliness === 'Clean' ? '✨' : stats.cleanliness === 'Moderate' ? '🧹' : '🪣'}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{stats.cleanliness}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Cleanliness</div>
              </div>
            </div>
          </motion.div>

          {/* Battery / Charge equivalent */}
          <motion.div whileHover={{ y: -2 }} style={{
            background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 18, padding: 18,
            display: 'flex', flexDirection: 'column', gap: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tyre Avg PSI</span>
              <Activity size={16} color="var(--accent)" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
              {tyreAvg.toFixed(1)}<span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}> PSI</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${Math.min(100, ((tyreAvg - 28) / 10) * 100)}%` }} transition={{ duration: 0.6 }}
                style={{ height: '100%', background: tyrePsiStatus(tyreAvg).color, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>28</span><span style={{ color: tyrePsiStatus(tyreAvg).color }}>{tyrePsiStatus(tyreAvg).label}</span><span>38 PSI</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Row 2: Tyre Pressure (Visual Top-Down Layout) ───────────── */}
      <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <BarChart3 size={18} color="var(--accent)" />
          <span style={{ fontWeight: 800, fontSize: 16 }}>Tyre Pressure Monitor (TPMS)</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 6 }}>Recommended: {TYRE_OPTIMAL.min}–{TYRE_OPTIMAL.max} PSI</span>
        </div>

        {/* Top-down car layout with tyres at corners */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gridTemplateRows: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
          <TyreCard label="Front Left"  psi={stats.tyrePressureFL} position="FL" />
          {/* Car center illustration */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: 0.5 }}>FRONT</div>
            <svg viewBox="0 0 80 140" width="80" height="140" style={{ opacity: 0.6 }}>
              <rect x="15" y="10" width="50" height="120" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <rect x="20" y="20" width="40" height="30" rx="5" fill="rgba(147,197,253,0.15)" />
              <rect x="20" y="90" width="40" height="25" rx="5" fill="rgba(147,197,253,0.1)" />
              <circle cx="40" cy="70" r="12" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
              <circle cx="40" cy="70" r="4" fill="rgba(255,255,255,0.15)" />
            </svg>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: 0.5 }}>REAR</div>
          </div>
          <TyreCard label="Front Right" psi={stats.tyrePressureFR} position="FR" />
          <TyreCard label="Rear Left"   psi={stats.tyrePressureRL} position="RL" />
          <div />
          <TyreCard label="Rear Right"  psi={stats.tyrePressureRR} position="RR" />
        </div>

        {/* Alert row */}
        {[stats.tyrePressureFL, stats.tyrePressureFR, stats.tyrePressureRL, stats.tyrePressureRR].some(p => p < 30 || p > 36) && (
          <div style={{ marginTop: 16, padding: '10px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>One or more tyres outside optimal range.</span>
            <span style={{ color: 'var(--muted)' }}>Check tyre pressure at the next stop.</span>
          </div>
        )}
      </div>

      {/* ── Row 3: Connection Status + Service ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Active Connection */}
        <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 20, padding: 22, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Radio size={17} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 15 }}>Active Connection</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Vehicle ID',   value: `#${vehicleId} (CyberCab)`, color: 'var(--text)'    },
              { label: 'Telemetry',    value: liveMode ? 'Streaming' : 'Disconnected', color: liveMode ? '#10b981' : '#ef4444' },
              { label: 'GPS Status',   value: gpsEnabled ? 'Locked' : 'No Lock', color: gpsEnabled ? '#10b981' : '#ef4444' },
              { label: 'Protocol',     value: wifiConnected ? 'WiFi + 4G LTE' : '4G LTE Only', color: 'var(--text)' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ConnPill icon={Wifi}      label="WiFi"      connected={wifiConnected}      ping={8}  />
            <ConnPill icon={Bluetooth} label="Bluetooth" connected={bluetoothConnected} ping={12} />
            <ConnPill icon={MapPin}    label="GPS"       connected={gpsEnabled}         ping={42} />
            <ConnPill icon={Zap}       label="Telemetry" connected={liveMode}           ping={3}  />
          </div>
        </div>

        {/* Service Reminder */}
        <div style={{ background: 'var(--panel-light)', border: `1px solid ${serviceColor}44`, borderRadius: 20, padding: 22, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wrench size={17} color={serviceColor} />
              <span style={{ fontWeight: 800, fontSize: 15 }}>Service Reminder</span>
            </div>
            <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 800, background: `${serviceColor}20`, color: serviceColor, border: `1px solid ${serviceColor}44` }}>
              {serviceUrgent ? '⚠️ Due Soon' : '✅ On Track'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Next Service Date', value: stats.serviceDueDate,           color: serviceColor },
              { label: 'Service Due At',    value: `${stats.serviceDueKm.toLocaleString()} km`, color: 'var(--text)'  },
              { label: 'Current Mileage',   value: `${stats.mileageKm.toFixed(0)} km`,         color: 'var(--text)'  },
              { label: 'Distance Left',     value: `${serviceKmLeft.toFixed(0)} km`,            color: serviceColor   },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Service distance bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>
              <span>0 km</span><span>Progress to next service</span><span>{stats.serviceDueKm.toLocaleString()} km</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
              <motion.div
                animate={{ width: `${Math.min(100, (stats.mileageKm / stats.serviceDueKm) * 100)}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${serviceColor}, ${serviceColor}88)`, borderRadius: 4 }}
              />
            </div>
          </div>

          {serviceUrgent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, fontSize: 12, color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} /> Vehicle service is overdue or coming within 500 km. Book an appointment.
              </div>
              <button
                onClick={performService}
                style={{
                  width: '100%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 10, padding: '10px 0', color: '#10b981', fontWeight: 700, fontSize: 12,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'background 0.2s, transform 0.1s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(16,185,129,0.12)'}
              >
                <Wrench size={13} /> Log Maintenance &amp; Reset Odometer
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
