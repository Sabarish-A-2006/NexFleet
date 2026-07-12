import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, Bluetooth, MapPin, Radio, Activity, Link as LinkIcon,
  Lock, Zap, Shield, Signal, RefreshCw, CheckCircle, XCircle,
  AlertTriangle, Server, Globe, BarChart3, Gauge
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

const NETWORK_POOL = [
  { ssid: 'NexFleet-Vehicle-Net',  band: '5 GHz',  security: 'WPA3', baseSignal: 92 },
  { ssid: 'Garage-Pro-5G',         band: '5 GHz',  security: 'WPA2', baseSignal: 78 },
  { ssid: 'CityMesh-Backbone',     band: '2.4 GHz',security: 'WPA2', baseSignal: 61 },
  { ssid: 'HighwayHub-V2X',        band: '5 GHz',  security: 'WPA3', baseSignal: 55 },
  { ssid: 'CafeLink-Public',       band: '2.4 GHz',security: 'Open', baseSignal: 44 },
  { ssid: 'CellBackup-4G-LTE',     band: '4G LTE', security: 'WPA3', baseSignal: 87 },
];

const BT_DEVICES = [
  { name: "Driver's iPhone 16 Pro", icon: '📱', rssi: -42, profile: 'HFP / A2DP' },
  { name: 'NexFleet Headunit',      icon: '🎵', rssi: -38, profile: 'AVRCP'      },
  { name: 'OBD-II Diagnostic Port', icon: '🔧', rssi: -55, profile: 'SPP'        },
];

// ─── Signal Bars ─────────────────────────────────────────────────────────────
function SignalBars({ strength, color }) {
  const bars = strength >= 85 ? 5 : strength >= 70 ? 4 : strength >= 55 ? 3 : strength >= 40 ? 2 : 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 4, height: 4 + i * 3, borderRadius: 2,
          background: i <= bars ? color : 'rgba(255,255,255,0.1)', transition: 'background 0.4s' }} />
      ))}
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, color = '#10b981' }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 12,
      background: checked ? color : 'rgba(255,255,255,0.1)',
      position: 'relative', cursor: 'pointer',
      border: `1px solid ${checked ? color : 'rgba(255,255,255,0.15)'}`,
      transition: 'background 0.3s', flexShrink: 0
    }}>
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ position: 'absolute', top: 2, width: 18, height: 18, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
      />
    </div>
  );
}

// ─── SVG Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, color, width = 160, height = 44 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 6 - ((v - min) / range) * (height - 12);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `M0,${height} L${pts.join(' L')} L${width},${height} Z`;
  const line = `M${pts.join(' L')}`;
  const gradId = `sg${color.replace(/[^a-z0-9]/gi,'')}`;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line}  fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      {(() => {
        const last = pts[pts.length - 1].split(',');
        return <circle cx={last[0]} cy={last[1]} r="3" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />;
      })()}
    </svg>
  );
}

// ─── Radial Signal Gauge ──────────────────────────────────────────────────────
function SignalGauge({ value, size = 72, color, label }) {
  const r    = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct  = value / 100;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          animate={{ strokeDasharray: `${pct * circ} ${(1-pct) * circ}` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 8, color: 'var(--muted)', fontWeight: 700 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Live Ping Ticker ────────────────────────────────────────────────────────
function PingTicker({ base, active }) {
  const [ping, setPing] = useState(base);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setPing(Math.round(base + (Math.random() - 0.4) * 12)), 1500);
    return () => clearInterval(t);
  }, [base, active]);
  const color = ping < 30 ? '#10b981' : ping < 80 ? '#f59e0b' : '#ef4444';
  return <span style={{ color, fontWeight: 800, fontFamily: 'monospace', fontSize: 13 }}>{active ? `${ping} ms` : '—'}</span>;
}

// ─── Throughput Ticker ────────────────────────────────────────────────────────
function ThroughputTicker({ downBase, upBase, active }) {
  const [down, setDown] = useState(downBase);
  const [up,   setUp]   = useState(upBase);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setDown(v => clamp(v + (Math.random() - 0.4) * 2.4, downBase * 0.4, downBase * 1.6));
      setUp(v  => clamp(v + (Math.random() - 0.4) * 1.2, upBase   * 0.4, upBase   * 1.6));
    }, 1200);
    return () => clearInterval(t);
  }, [downBase, upBase, active]);
  return (
    <div style={{ display: 'flex', gap: 14, fontSize: 11 }}>
      <span style={{ color: '#10b981' }}>↓ {active ? down.toFixed(1) : '—'} Mbps</span>
      <span style={{ color: '#3b82f6' }}>↑ {active ? up.toFixed(1) : '—'} Mbps</span>
    </div>
  );
}

// ─── Network Topology Diagram ─────────────────────────────────────────────────
function TopologyDiagram({ wifi, bluetooth, gps, lte }) {
  // Node positions: center vehicle + 4 radial nodes
  const CX = 300, CY = 160;
  const nodes = [
    { id: 'wifi', label: 'Wi-Fi',     emoji: '📶', x: CX - 200, y: CY - 60, color: '#3b82f6', active: wifi      },
    { id: 'bt',   label: 'Bluetooth', emoji: '🔵', x: CX - 200, y: CY + 60, color: '#8b5cf6', active: bluetooth  },
    { id: 'gps',  label: 'GPS',       emoji: '🛰️', x: CX + 200, y: CY - 60, color: '#f59e0b', active: gps        },
    { id: 'lte',  label: '4G LTE',    emoji: '📡', x: CX + 200, y: CY + 60, color: '#10b981', active: lte        },
  ];

  return (
    <svg width="600" height="320" viewBox="0 0 600 320" style={{ maxWidth: '100%', overflow: 'visible' }}>
      <defs>
        {nodes.map(n => (
          <React.Fragment key={n.id}>
            <linearGradient id={`lg-${n.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={n.color} stopOpacity={n.active ? 0.8 : 0.15} />
              <stop offset="100%" stopColor={n.color} stopOpacity={n.active ? 0.2 : 0.05} />
            </linearGradient>
            {n.active && (
              <filter id={`glow-${n.id}`}>
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            )}
          </React.Fragment>
        ))}
      </defs>

      {/* Connection lines with animated data flow */}
      {nodes.map(n => (
        <g key={n.id}>
          {/* Base line */}
          <line x1={CX} y1={CY} x2={n.x} y2={n.y}
            stroke={n.active ? n.color : 'rgba(255,255,255,0.06)'}
            strokeWidth={n.active ? 2 : 1}
            strokeDasharray="6 4"
            style={{ transition: 'stroke 0.5s' }}
          />
          {/* Animated data packet (circle traveling on the line) */}
          {n.active && (
            <circle r="5" fill={n.color} style={{ filter: `drop-shadow(0 0 6px ${n.color})` }}>
              <animateMotion dur={`${1.8 + Math.random()}s`} repeatCount="indefinite">
                <mpath href={`#path-${n.id}`} />
              </animateMotion>
            </circle>
          )}
          <path id={`path-${n.id}`} d={`M${CX},${CY} L${n.x},${n.y}`} fill="none" />
        </g>
      ))}

      {/* External node circles */}
      {nodes.map(n => (
        <g key={n.id}>
          {/* Glow ring if active */}
          {n.active && (
            <circle cx={n.x} cy={n.y} r={34}
              fill="none" stroke={n.color} strokeWidth={1} strokeOpacity={0.25}
              style={{ animation: 'pulse-ring 2s ease-out infinite' }}
            />
          )}
          {/* Main circle */}
          <circle cx={n.x} cy={n.y} r={28}
            fill={n.active ? `${n.color}18` : 'rgba(255,255,255,0.03)'}
            stroke={n.active ? n.color : 'rgba(255,255,255,0.1)'}
            strokeWidth={n.active ? 1.5 : 1}
            style={{ transition: 'all 0.5s' }}
          />
          <text x={n.x} y={n.y - 4} textAnchor="middle" fontSize="16">{n.emoji}</text>
          <text x={n.x} y={n.y + 16} textAnchor="middle" fontSize="9" fontWeight="700"
            fill={n.active ? n.color : 'rgba(255,255,255,0.3)'} style={{ fontFamily: 'Outfit, sans-serif' }}>
            {n.label}
          </text>

          {/* Status dot */}
          <circle cx={n.x + 20} cy={n.y - 20} r={5}
            fill={n.active ? '#10b981' : '#ef4444'}
            style={{ filter: n.active ? 'drop-shadow(0 0 4px #10b981)' : 'none', transition: 'all 0.4s' }}
          />
        </g>
      ))}

      {/* Center vehicle hub */}
      <circle cx={CX} cy={CY} r={44}
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
      />
      <circle cx={CX} cy={CY} r={36}
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
      />
      <text x={CX} y={CY - 8} textAnchor="middle" fontSize="20">🚗</text>
      <text x={CX} y={CY + 10} textAnchor="middle" fontSize="9" fontWeight="800"
        fill="rgba(255,255,255,0.6)" style={{ fontFamily: 'Outfit, sans-serif' }}>CyberCab #1</text>
      <text x={CX} y={CY + 22} textAnchor="middle" fontSize="8"
        fill="rgba(255,255,255,0.3)" style={{ fontFamily: 'Outfit, sans-serif' }}>Vehicle Hub</text>
    </svg>
  );
}

// ─── Signal History Mini-Chart ────────────────────────────────────────────────
function SignalHistoryChart({ histories }) {
  const W = 500, H = 120;
  const maxPts = 30;
  const colors = { wifi: '#3b82f6', bt: '#8b5cf6', gps: '#f59e0b', lte: '#10b981' };
  const labels = { wifi: 'Wi-Fi', bt: 'Bluetooth', gps: 'GPS', lte: '4G LTE' };
  const gradIds = { wifi: 'gw', bt: 'gb', gps: 'gg', lte: 'gl' };

  const makePath = (data, w, h) => {
    if (!data || data.length < 2) return '';
    const pts = data.map((v, i) => {
      const x = (i / (maxPts - 1)) * w;
      const y = h - 4 - (v / 100) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${pts.join(' L')}`;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Y-axis labels */}
      <div style={{ position: 'absolute', left: 0, top: 0, height: H, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 4 }}>
        {[100, 75, 50, 25, 0].map(v => (
          <span key={v} style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'monospace', lineHeight: 1 }}>{v}%</span>
        ))}
      </div>

      <svg width={W} height={H} style={{ marginLeft: 28, display: 'block', overflow: 'visible' }}>
        <defs>
          {Object.entries(colors).map(([k, c]) => (
            <linearGradient key={k} id={gradIds[k]} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={c} stopOpacity="0.3" />
              <stop offset="100%" stopColor={c} stopOpacity="0"   />
            </linearGradient>
          ))}
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(v => {
          const y = H - 4 - (v / 100) * (H - 8);
          return (
            <line key={v} x1={0} y1={y} x2={W} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 4" />
          );
        })}

        {/* Signal lines */}
        {Object.entries(histories).map(([k, data]) => (
          <g key={k}>
            <path
              d={`${makePath(data, W, H)} L${W},${H} L0,${H} Z`}
              fill={`url(#${gradIds[k]})`}
            />
            <path
              d={makePath(data, W, H)}
              fill="none" stroke={colors[k]} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Latest dot */}
            {data && data.length > 0 && (() => {
              const last = data[data.length - 1];
              const x = ((data.length - 1) / (maxPts - 1)) * W;
              const y = H - 4 - (last / 100) * (H - 8);
              return <circle cx={x} cy={y} r="3" fill={colors[k]} style={{ filter: `drop-shadow(0 0 4px ${colors[k]})` }} />;
            })()}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginLeft: 28, marginTop: 10, flexWrap: 'wrap' }}>
        {Object.entries(colors).map(([k, c]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 20, height: 2, background: c, borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>{labels[k]}</span>
          </div>
        ))}
        <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>← Last 30 readings (2s interval)</span>
      </div>
    </div>
  );
}

// ─── Throughput Timeline (stacked bars) ──────────────────────────────────────
function ThroughputTimeline({ history }) {
  const W = 500, H = 80, bars = 24;
  const recent = history.slice(-bars);
  const maxVal = Math.max(...recent.map(r => r.down + r.up), 1);

  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      {/* Grid */}
      {[0, 0.5, 1].map(f => {
        const y = H - f * H;
        return <line key={f} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
      })}

      {/* Stacked bars */}
      {recent.map((r, i) => {
        const bw  = (W / bars) - 2;
        const x   = i * (W / bars) + 1;
        const dh  = ((r.down) / maxVal) * H;
        const uh  = ((r.up)   / maxVal) * H;
        return (
          <g key={i}>
            {/* Download (bottom) */}
            <rect x={x} y={H - dh} width={bw} height={dh}
              fill="#10b981" fillOpacity={0.7} rx={1} />
            {/* Upload (stacked on top) */}
            <rect x={x} y={H - dh - uh} width={bw} height={uh}
              fill="#3b82f6" fillOpacity={0.7} rx={1} />
          </g>
        );
      })}

      {/* Current value label */}
      {recent.length > 0 && (() => {
        const last = recent[recent.length - 1];
        return (
          <text x={W - 4} y={12} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="monospace">
            {`↓${last.down.toFixed(1)} ↑${last.up.toFixed(1)} Mbps`}
          </text>
        );
      })()}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Connectivity() {
  const {
    wifiConnected, bluetoothConnected, gpsEnabled, liveMode,
    setWifiConnected, setBluetoothConnected, setGpsEnabled
  } = useApp();

  const [scanSeed,  setScanSeed]  = useState(0);
  const [scanning,  setScanning]  = useState(false);
  const [activeNet, setActiveNet] = useState('NexFleet-Vehicle-Net');
  const [signalMap, setSignalMap] = useState({});
  const [packets,   setPackets]   = useState({ sent: 1247, received: 1241, lost: 6 });
  const [uptime,    setUptime]    = useState({ h: 3, m: 14, s: 22 });

  // Signal histories for sparklines (last 30 readings)
  const [signalHistory, setSignalHistory] = useState({ wifi: [], bt: [], gps: [], lte: [] });
  // Throughput history (last 24 readings)
  const [throughputHistory, setThroughputHistory] = useState([]);

  // Fluctuate signals every 2 s + record history
  useEffect(() => {
    const tick = () => {
      const m = {};
      NETWORK_POOL.forEach(n => {
        m[n.ssid] = clamp(n.baseSignal + Math.round((Math.random() - 0.5) * 8), 20, 99);
      });
      setSignalMap(m);

      setSignalHistory(prev => ({
        wifi: [...prev.wifi.slice(-29),  wifiConnected      ? (m['NexFleet-Vehicle-Net'] || 92) : 0],
        bt:   [...prev.bt.slice(-29),   bluetoothConnected  ? clamp(88 + Math.round((Math.random()-0.5)*6), 70, 99) : 0],
        gps:  [...prev.gps.slice(-29),  gpsEnabled          ? clamp(95 + Math.round((Math.random()-0.5)*4), 85, 99) : 0],
        lte:  [...prev.lte.slice(-29),  liveMode            ? (m['CellBackup-4G-LTE'] || 87) : 0],
      }));

      setThroughputHistory(prev => {
        const down = wifiConnected ? clamp(52 + (Math.random()-0.4)*18, 8, 85) : liveMode ? clamp(28 + (Math.random()-0.4)*12, 4, 45) : 0;
        const up   = wifiConnected ? clamp(18 + (Math.random()-0.4)*8,  2, 30) : liveMode ? clamp(8  + (Math.random()-0.4)*4,  1, 15) : 0;
        return [...prev.slice(-23), { down, up }];
      });
    };
    tick();
    const t = setInterval(tick, 2000);
    return () => clearInterval(t);
  }, [scanSeed, wifiConnected, bluetoothConnected, gpsEnabled, liveMode]);

  // Packet counter
  useEffect(() => {
    if (!wifiConnected && !liveMode) return;
    const t = setInterval(() => {
      setPackets(prev => {
        const sent = prev.sent + Math.floor(Math.random() * 5) + 1;
        const recv = prev.received + Math.floor(Math.random() * 5);
        return { sent, received: recv, lost: sent - recv };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [wifiConnected, liveMode]);

  // Uptime
  useEffect(() => {
    const t = setInterval(() => {
      setUptime(prev => {
        let s = prev.s + 1, m = prev.m, h = prev.h;
        if (s >= 60) { s = 0; m++; }
        if (m >= 60) { m = 0; h++; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanSeed(s => s + 1); }, 2200);
  };

  const wifiSignal = signalMap['NexFleet-Vehicle-Net'] || 92;
  const cellSignal = signalMap['CellBackup-4G-LTE']    || 87;
  const packetLossPct = packets.sent > 0 ? ((packets.lost / packets.sent) * 100).toFixed(2) : '0.00';
  const connectedCount = [wifiConnected, bluetoothConnected, gpsEnabled, liveMode].filter(Boolean).length;
  const overallHealth  = Math.round((connectedCount / 4) * 100);
  const healthColor    = overallHealth >= 75 ? '#10b981' : overallHealth >= 50 ? '#f59e0b' : '#ef4444';

  const IFACES = [
    { key: 'wifi', label: 'Wi-Fi',          sub: wifiConnected      ? 'NexFleet-Vehicle-Net' : 'Disconnected',      icon: Wifi,     color: '#3b82f6', active: wifiConnected,      toggle: setWifiConnected,      signal: wifiSignal, ping: 8,  down: 52.4, up: 18.1 },
    { key: 'bt',   label: 'Bluetooth',       sub: bluetoothConnected ? "Driver's Phone Connected" : 'No Devices',    icon: Bluetooth,color: '#8b5cf6', active: bluetoothConnected,  toggle: setBluetoothConnected, signal: bluetoothConnected ? 88 : 0, ping: 12, down: 2.1, up: 1.4 },
    { key: 'gps',  label: 'GPS / Location',  sub: gpsEnabled         ? 'High-Accuracy Locked' : 'Tracking Disabled', icon: MapPin,   color: '#f59e0b', active: gpsEnabled,          toggle: setGpsEnabled,         signal: gpsEnabled ? 95 : 0, ping: 42, down: 0.1, up: 0.1 },
    { key: 'lte',  label: '4G LTE Cellular', sub: liveMode           ? 'Active Telemetry Link' : 'Telemetry Off',   icon: Signal,   color: '#10b981', active: liveMode,            toggle: null,                  signal: cellSignal, ping: 24, down: 28.6, up: 8.3 },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 18, fontFamily: "'Outfit', sans-serif" }}>

      {/* ─── Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Radio size={24} color="var(--accent)" /> Connectivity Hub
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 13 }}>
            Vehicle #1 · CyberCab ·{' '}
            <span style={{ color: healthColor, fontWeight: 700 }}>{connectedCount}/4 interfaces active</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ padding: '8px 16px', borderRadius: 12, background: healthColor + '15', border: `1px solid ${healthColor}44`, fontSize: 12, fontWeight: 700, color: healthColor }}>
            System Health {overallHealth}%
          </div>
          <div style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>
            ⏱ {String(uptime.h).padStart(2,'0')}:{String(uptime.m).padStart(2,'0')}:{String(uptime.s).padStart(2,'0')}
          </div>
        </div>
      </div>

      {/* ─── Row 1: Interface Control Cards ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {IFACES.map(iface => {
          const hist = signalHistory[iface.key] || [];
          return (
            <motion.div key={iface.key} whileHover={{ y: -2 }}
              style={{
                background: 'var(--panel-light)',
                border: `1.5px solid ${iface.active ? iface.color + '44' : 'var(--panel-border)'}`,
                borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', gap: 12,
                boxShadow: iface.active ? `0 4px 20px ${iface.color}12` : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: 10, borderRadius: 12, background: iface.active ? `${iface.color}18` : 'rgba(255,255,255,0.04)' }}>
                  <iface.icon size={20} color={iface.active ? iface.color : 'var(--muted)'} />
                </div>
                {iface.toggle
                  ? <ToggleSwitch checked={iface.active} onChange={iface.toggle} color={iface.color} />
                  : <span style={{ fontSize: 9, fontWeight: 700, color: iface.active ? '#10b981' : 'var(--muted)', border: `1px solid ${iface.active ? '#10b981' : 'var(--panel-border)'}44`, padding: '3px 7px', borderRadius: 99 }}>
                      {iface.active ? 'AUTO' : 'OFF'}
                    </span>
                }
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{iface.label}</div>
                <div style={{ fontSize: 11, color: iface.active ? iface.color : 'var(--muted)', marginTop: 2, fontWeight: 600 }}>{iface.sub}</div>
              </div>

              {/* Inline sparkline */}
              <div style={{ overflow: 'hidden' }}>
                <Sparkline data={hist} color={iface.color} width={150} height={38} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.4 }}>Signal</div>
                  <SignalBars strength={iface.active ? iface.signal : 0} color={iface.color} />
                </div>
                <SignalGauge value={iface.active ? iface.signal : 0} size={54} color={iface.color} label="%" />
              </div>

              <div style={{ paddingTop: 8, borderTop: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--muted)' }}>Latency</span>
                  <PingTicker base={iface.ping} active={iface.active} />
                </div>
                <ThroughputTicker downBase={iface.down} upBase={iface.up} active={iface.active} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Row 2: Packets + Security + BT Devices ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

        {/* Packet Stats */}
        <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <BarChart3 size={16} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Packet Statistics</span>
          </div>
          {[
            { label: 'Packets Sent',     value: packets.sent.toLocaleString(),       color: '#3b82f6' },
            { label: 'Packets Received', value: packets.received.toLocaleString(),   color: '#10b981' },
            { label: 'Packets Lost',     value: packets.lost.toLocaleString(),        color: '#ef4444' },
            { label: 'Packet Loss',      value: `${packetLossPct}%`,                 color: parseFloat(packetLossPct) < 1 ? '#10b981' : '#ef4444' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: row.color, fontFamily: 'monospace' }}>{row.value}</span>
            </div>
          ))}
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
            <motion.div animate={{ width: `${Math.min(100, 100 - parseFloat(packetLossPct) * 10)}%` }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Network Security */}
        <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <Shield size={16} color="#10b981" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Network Security</span>
          </div>
          {[
            { label: 'Firewall',    value: 'Active',           color: '#10b981', icon: '🛡️' },
            { label: 'Encryption',  value: 'AES-256-GCM',      color: '#3b82f6', icon: '🔐' },
            { label: 'VPN Tunnel',  value: wifiConnected ? 'Established' : 'Offline', color: wifiConnected ? '#10b981' : '#ef4444', icon: '🔒' },
            { label: 'Cert Status', value: 'Valid · 89 days',  color: '#f59e0b', icon: '📋' },
            { label: 'IDS / IPS',   value: 'Monitoring',       color: '#10b981', icon: '👁️' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5 }}>{row.icon} {row.label}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Paired Bluetooth Devices */}
        <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bluetooth size={16} color="#8b5cf6" />
              <span style={{ fontWeight: 800, fontSize: 14 }}>Paired BT Devices</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: bluetoothConnected ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)', color: bluetoothConnected ? '#8b5cf6' : 'var(--muted)' }}>
              {bluetoothConnected ? `${BT_DEVICES.length} Active` : 'OFF'}
            </span>
          </div>
          {BT_DEVICES.map(dev => (
            <div key={dev.name} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: bluetoothConnected ? 1 : 0.35, transition: 'opacity 0.3s' }}>
              <span style={{ fontSize: 18 }}>{dev.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dev.name}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{dev.profile} · {dev.rssi} dBm</div>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: bluetoothConnected ? '#10b981' : '#ef4444', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Row 3: Wi-Fi Network Scanner ────────────────────────── */}
      <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 18, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wifi size={16} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 15 }}>Available Networks</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>Signal updates every 2s</span>
          </div>
          <button onClick={handleScan} disabled={scanning} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', fontWeight: 700, fontSize: 12, cursor: scanning ? 'not-allowed' : 'pointer', opacity: scanning ? 0.7 : 1 }}>
            <RefreshCw size={13} style={{ animation: scanning ? 'spin 1s linear infinite' : 'none' }} />
            {scanning ? 'Scanning...' : 'Rescan'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 120px 100px', gap: 12, padding: '6px 14px', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            <span>SSID</span><span>Band</span><span>Signal</span><span>Security</span><span>Throughput</span><span>Status</span>
          </div>

          <AnimatePresence>
            {NETWORK_POOL.map((net, idx) => {
              const sig     = signalMap[net.ssid] || net.baseSignal;
              const isConn  = net.ssid === activeNet && wifiConnected;
              const sigColor= sig >= 75 ? '#10b981' : sig >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <motion.div key={net.ssid}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  onClick={() => wifiConnected && setActiveNet(net.ssid)}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 120px 100px',
                    gap: 12, padding: '12px 14px',
                    background: isConn ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isConn ? 'rgba(59,130,246,0.3)' : 'var(--panel-border)'}`,
                    borderRadius: 12, cursor: wifiConnected ? 'pointer' : 'default',
                    alignItems: 'center', transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Wifi size={13} color={isConn ? '#3b82f6' : 'var(--muted)'} />
                    <span style={{ fontWeight: 700, fontSize: 12, color: isConn ? '#3b82f6' : 'var(--text)' }}>{net.ssid}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{net.band}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <SignalBars strength={sig} color={sigColor} />
                    <span style={{ fontSize: 10, color: sigColor, fontFamily: 'monospace' }}>{sig}%</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: net.security === 'Open' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.1)', color: net.security === 'Open' ? '#ef4444' : '#10b981' }}>{net.security}</span>
                  <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ color: '#10b981' }}>↓ {(sig * 0.6).toFixed(0)} Mbps</span>
                    <span style={{ color: '#3b82f6' }}>↑ {(sig * 0.2).toFixed(0)} Mbps</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: isConn ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)', color: isConn ? '#3b82f6' : 'var(--muted)', border: `1px solid ${isConn ? 'rgba(59,130,246,0.4)' : 'var(--panel-border)'}` }}>
                    {isConn ? '✓ Connected' : 'Available'}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Graphs: Network Topology + Signal History ────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Topology Diagram */}
        <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Globe size={15} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Network Topology</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>Live connection map</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <TopologyDiagram wifi={wifiConnected} bluetooth={bluetoothConnected} gps={gpsEnabled} lte={liveMode} />
          </div>
        </div>

        {/* Signal History Chart */}
        <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Activity size={15} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Signal Strength History</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>All interfaces · last 60s</span>
          </div>
          <SignalHistoryChart histories={signalHistory} />
        </div>
      </div>

      {/* ─── Throughput Timeline ──────────────────────────────────── */}
      <div style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 20, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={15} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Throughput Timeline</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>Combined bandwidth · last 48s</span>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, background: '#10b981', borderRadius: 2 }} /> Download
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, background: '#3b82f6', borderRadius: 2 }} /> Upload
            </span>
          </div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--muted)', marginBottom: 4, fontFamily: 'monospace' }}>
            <span>100 Mbps</span><span>50 Mbps</span><span>0</span>
          </div>
          <ThroughputTimeline history={throughputHistory} />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-ring {
          0%   { transform: scale(1);    opacity: 0.6; }
          70%  { transform: scale(1.3);  opacity: 0;   }
          100% { transform: scale(1.3);  opacity: 0;   }
        }
      `}</style>
    </div>
  );
}
