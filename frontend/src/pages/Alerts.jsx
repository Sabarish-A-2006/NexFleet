import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios.js';
import { useApp } from '../context/AppContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, History, AlertTriangle, RefreshCw,
  Search, Download, CheckCircle, Siren, Activity,
  ChevronDown, XCircle, Bell, ScanLine, Clock,
  TrendingUp, BarChart3
} from 'lucide-react';

// ─── Stage Config ────────────────────────────────────────────────────────────
const STAGE_CONFIG = {
  SEVERE_CRASH:     { label: 'Severe Crash',     icon: '🚨', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  SMALL_CRASH:      { label: 'Minor Collision',   icon: '💥', color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
  WARNING:          { label: 'Impact Warning',    icon: '⚠️', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  FALSE_ALARM:      { label: 'False Alarm',       icon: '✅', color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  DIAGNOSTIC_CHECK: { label: 'Diagnostic',        icon: '🔬', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  TRAFFIC_HAZARD:   { label: 'Traffic Hazard',    icon: '🚧', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  UNKNOWN:          { label: 'Unknown',           icon: '❓', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' },
};
const STATUS_CONFIG = {
  EMERGENCY_DISPATCHED: { label: 'Emergency Dispatched', color: '#ef4444', bg: 'rgba(239,68,68,0.15)',    isActive: true  },
  ACTIVE:               { label: 'Active',               color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    isActive: true  },
  LOGGED:               { label: 'Monitoring',           color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   isActive: true  },
  DRIVER_OVERRIDE:      { label: 'Driver Override',      color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',   isActive: false },
  RESOLVED:             { label: 'Resolved',             color: '#10b981', bg: 'rgba(16,185,129,0.12)',   isActive: false },
  CLEARED:              { label: 'Cleared',              color: '#10b981', bg: 'rgba(16,185,129,0.10)',   isActive: false },
};
const getStage  = (s) => STAGE_CONFIG[s]  || STAGE_CONFIG.UNKNOWN;
const getStatus = (s) => STATUS_CONFIG[s] || { label: s, color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', isActive: false };
const isActiveStatus = (status) => getStatus(status).isActive;

const severityFromStage = (stage) => {
  if (stage === 'SEVERE_CRASH')   return 'CRITICAL';
  if (stage === 'SMALL_CRASH')    return 'HIGH';
  if (stage === 'WARNING')        return 'MEDIUM';
  if (stage === 'TRAFFIC_HAZARD') return 'LOW';
  return 'INFO';
};
const SEVERITY_ORDER = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, INFO: 0 };

// ─── Time helper ─────────────────────────────────────────────────────────────
const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso || Date.now()).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60)   return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)   return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Derived report metrics ───────────────────────────────────────────────────
function buildReport(alerts) {
  const total    = alerts.length;
  const critical = alerts.filter(a => a.stage === 'SEVERE_CRASH').length;
  const active   = alerts.filter(a => isActiveStatus(a.status)).length;
  const resolved = alerts.filter(a => !isActiveStatus(a.status)).length;

  // Breakdown by stage
  const byStage = {};
  alerts.forEach(a => { byStage[a.stage] = (byStage[a.stage] || 0) + 1; });

  // Last 7 days — incidents per day
  const daily = {};
  for (let d = 6; d >= 0; d--) {
    const key = new Date(Date.now() - d * 86400000).toLocaleDateString('en-IN', { weekday: 'short' });
    daily[key] = 0;
  }
  alerts.forEach(a => {
    const key = new Date(a.createdAt || Date.now()).toLocaleDateString('en-IN', { weekday: 'short' });
    if (key in daily) daily[key]++;
  });

  return { total, critical, active, resolved, byStage, daily };
}

// ─── Components ──────────────────────────────────────────────────────────────

// Big metric card with coloured bar fill
function MetricCard({ icon, label, value, total, color, bg, sub, pulsing }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      style={{
        background: 'var(--panel-light)', border: `1px solid ${color}33`,
        borderRadius: 18, padding: '20px 22px',
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: pulsing ? `0 0 24px ${color}25` : 'none',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Soft background tint */}
      <div style={{ position: 'absolute', inset: 0, background: bg, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 10, padding: 8, display: 'flex' }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
        </div>
        {pulsing && (
          <motion.span
            animate={{ scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }}
          />
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 40, fontWeight: 900, color, lineHeight: 1.1, marginTop: 2 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
      </div>

      {/* Fill bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 2 }}
        />
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>{pct}% of total</div>
    </motion.div>
  );
}

// Horizontal bar chart for incident type breakdown
function BreakdownBar({ label, count, total, color, icon }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 14, width: 20 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{label}</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color }}>{count}</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ height: '100%', background: color, borderRadius: 3 }}
          />
        </div>
      </div>
    </div>
  );
}

// Daily sparkline bars
function DailyChart({ daily }) {
  const vals = Object.values(daily);
  const peak = Math.max(...vals, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50 }}>
      {Object.entries(daily).map(([day, cnt]) => (
        <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(cnt / peak) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              background: cnt > 2 ? '#ef4444' : cnt > 0 ? '#f59e0b' : 'rgba(255,255,255,0.08)',
              minHeight: 3
            }}
          />
          <span style={{ fontSize: 8, color: 'var(--muted)', fontWeight: 700 }}>{day}</span>
        </div>
      ))}
    </div>
  );
}

// Expandable alert row
function AlertRow({ alert, onExport }) {
  const [open, setOpen] = useState(false);
  const cfg = getStage(alert.stage);
  const stCfg = getStatus(alert.status);
  const sev = severityFromStage(alert.stage);
  const active = isActiveStatus(alert.status);

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ borderBottom: '1px solid var(--panel-border)' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'grid',
          gridTemplateColumns: '28px 120px 1fr 100px 140px 32px',
          gap: 12, alignItems: 'center', padding: '11px 16px', cursor: 'pointer',
          background: open ? 'rgba(255,255,255,0.025)' : 'transparent',
          transition: 'background 0.15s',
          borderLeft: `3px solid ${active ? cfg.color : 'transparent'}`,
        }}
      >
        <span style={{ fontSize: 15, textAlign: 'center' }}>{cfg.icon}</span>

        <div>
          <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: active ? cfg.color : 'var(--muted)' }}>
            {alert.id}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{timeAgo(alert.createdAt)}</div>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{cfg.label}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {alert.message}
          </div>
        </div>

        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, whiteSpace: 'nowrap' }}>
          {sev}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {active && <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: stCfg.color, display: 'inline-block', flexShrink: 0 }} />}
          <span style={{ fontSize: 12, fontWeight: 700, color: stCfg.color }}>{stCfg.label}</span>
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} color="var(--muted)" />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}
          >
            <div style={{
              margin: '0 16px 12px', padding: 16,
              background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: 12
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 12 }}>
                {[
                  { l: 'Incident ID',   v: alert.id,          mono: true },
                  { l: 'Vehicle ID',    v: `VH-${alert.vehicleId || '001'}`, mono: true },
                  { l: 'Severity',      v: sev,               color: cfg.color },
                  { l: 'Status',        v: stCfg.label,       color: stCfg.color },
                ].map(item => (
                  <div key={item.l}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{item.l}</div>
                    <div style={{ fontFamily: item.mono ? 'monospace' : 'inherit', fontWeight: 700, fontSize: 13, color: item.color || 'var(--text)' }}>{item.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Full Description</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)' }}>{alert.message}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>
                  {new Date(alert.createdAt || Date.now()).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' })}
                </div>
                <button onClick={e => { e.stopPropagation(); onExport(alert); }}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--panel-border)', borderRadius: 8, padding: '5px 12px', color: 'var(--text)', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Download size={11} /> Export JSON
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Sensor status pill
function SensorRow({ label, online, ping }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--panel-border)' }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {ping !== undefined && <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{ping}ms</span>}
        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: online ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: online ? '#10b981' : '#ef4444', border: `1px solid ${online ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
          ● {online ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Alerts() {
  const { crashStage, crashCountdown, crashActive, triggerImpact, liveMode, cancelCrashAlert } = useApp();
  const { pushNotification } = useNotifications();
  const [alerts, setAlerts]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [activeTab, setActiveTab]   = useState('all');   // 'all' | 'active' | 'resolved'
  const [search, setSearch]         = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [sortBy, setSortBy]         = useState('newest');
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagProgress, setDiagProgress] = useState(0);
  const lastPollRef = useRef(null);

  const loadAlerts = () => {
    setLoading(true);
    lastPollRef.current = new Date();
    api.get('/alerts')
      .then(res => {
        const payload = res.data?.data || res.data || [];
        setAlerts(Array.isArray(payload) ? payload : []);
      })
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAlerts(); }, []);
  useEffect(() => {
    if (!liveMode) return;
    const intervalTime = crashActive ? 2000 : 15000;
    const t = setInterval(loadAlerts, intervalTime);
    return () => clearInterval(t);
  }, [liveMode, crashActive]);

  const handleSimulateImpact = async () => {
    await triggerImpact();
    setTimeout(loadAlerts, 400);
  };

  const handleCancelCrash = async () => {
    await cancelCrashAlert();
    setTimeout(loadAlerts, 400);
  };

  // ── Report metrics derived from raw alert list ──────────────────────────
  const report = buildReport(alerts);

  // ── Tab filter ───────────────────────────────────────────────────────────
  const tabFiltered = alerts.filter(a => {
    if (activeTab === 'active')   return isActiveStatus(a.status);
    if (activeTab === 'resolved') return !isActiveStatus(a.status);
    return true;
  });

  // ── Search + severity + sort ─────────────────────────────────────────────
  const displayed = tabFiltered
    .filter(a => {
      const sev = severityFromStage(a.stage);
      if (filterSeverity !== 'ALL' && sev !== filterSeverity) return false;
      if (search) {
        const q = search.toLowerCase();
        return (a.message || '').toLowerCase().includes(q)
          || (a.stage || '').toLowerCase().includes(q)
          || String(a.id).toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')   return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest')   return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'severity') return (SEVERITY_ORDER[severityFromStage(b.stage)] || 0) - (SEVERITY_ORDER[severityFromStage(a.stage)] || 0);
      return 0;
    });

  // ── Diagnostics ──────────────────────────────────────────────────────────
  const runDiagnostics = async () => {
    setDiagRunning(true); setDiagProgress(0);
    pushNotification('Initiating full sensor diagnostics…', 'info');
    const steps = [
      { pct: 20, msg: '🔬 Checking LIDAR array…', delay: 600 },
      { pct: 40, msg: '📡 Verifying V2X modules…', delay: 500 },
      { pct: 60, msg: '🛰️ Testing GPS lock…', delay: 700 },
      { pct: 80, msg: '💻 Running crash sensor self-test…', delay: 600 },
      { pct: 100, msg: '✅ All systems operational.', delay: 400 },
    ];
    for (const s of steps) {
      await new Promise(r => setTimeout(r, s.delay));
      setDiagProgress(s.pct);
      if (s.pct < 100) pushNotification(s.msg, 'info');
    }
    try {
      await api.post('/alerts', { vehicleId: 1, stage: 'DIAGNOSTIC_CHECK', status: 'CLEARED', message: 'Full system diagnostic: LIDAR ✓  V2X ✓  GPS ✓  Crash sensors ✓  All 360° sensors fully operational.' });
      loadAlerts();
      pushNotification('✅ Diagnostics complete — all systems nominal.', 'success');
    } catch (_) {}
    await new Promise(r => setTimeout(r, 300));
    setDiagRunning(false); setDiagProgress(0);
  };

  // ── CSV export ───────────────────────────────────────────────────────────
  const exportCsv = () => {
    const hdr = 'ID,Stage,Severity,Status,Message,Timestamp\n';
    const rows = displayed.map(a =>
      `"${a.id}","${a.stage}","${severityFromStage(a.stage)}","${a.status}","${(a.message||'').replace(/"/g,'""')}","${new Date(a.createdAt||Date.now()).toISOString()}"`
    ).join('\n');
    const blob = new Blob([hdr + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const el   = document.createElement('a');
    el.href = url; el.download = 'incident-report.csv'; el.click();
    URL.revokeObjectURL(url);
    pushNotification(`Exported ${displayed.length} records as CSV`, 'success');
  };

  const exportJson = (alert) => {
    const blob = new Blob([JSON.stringify(alert, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const el   = document.createElement('a');
    el.href = url; el.download = `incident-${alert.id}.json`; el.click();
    URL.revokeObjectURL(url);
    pushNotification(`Exported incident ${alert.id}`, 'success');
  };

  const tabs = [
    { id: 'all',      label: 'All Incidents',      count: report.total },
    { id: 'active',   label: 'Active / Ongoing',   count: report.active },
    { id: 'resolved', label: 'Resolved / Previous', count: report.resolved },
  ];

  return (
    <motion.div className="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gap: 20 }}>

      {/* ── Emergency Banner ─────────────────────────────────────────── */}
      <AnimatePresence>
        {crashActive && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            style={{ padding: '16px 24px', background: 'rgba(239,68,68,0.1)', border: '1.5px solid #ef4444', borderRadius: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 6px 36px rgba(239,68,68,0.2)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ background: '#ef4444', padding: 10, borderRadius: 12, color: '#fff', display: 'flex' }}>
                <Siren size={22} />
              </motion.div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>🚨 CRASH PROTOCOL ACTIVE — STAGE: {crashStage}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>
                  Emergency auto-dispatch in <strong style={{ color: '#ef4444' }}>{crashCountdown}s</strong>. Cancel only if confirmed false alarm.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 34, fontWeight: 900, color: '#ef4444' }}>
                {String(Math.floor((crashCountdown || 0) / 60)).padStart(2, '0')}:{String((crashCountdown || 0) % 60).padStart(2, '0')}
              </div>
              <button onClick={handleCancelCrash} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 12, padding: '10px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <XCircle size={15} /> False Alarm — Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page title ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert size={24} color="var(--danger)" /> Alerts &amp; Incident Logs
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: 14 }}>
            All recorded safety events · Evaluated in real time from incident reports
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadAlerts} style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 10, padding: '8px 12px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <button onClick={exportCsv} disabled={displayed.length === 0} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '8px 14px', color: '#3b82f6', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={13} /> Export Report CSV
          </button>
        </div>
      </div>

      {/* ── REPORT SUMMARY: 4 Metric Cards ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <MetricCard icon="📋" label="Total Incidents"  value={report.total}    total={report.total} color="#3b82f6" bg="rgba(59,130,246,0.04)"    sub="All recorded events" />
        <MetricCard icon="🚨" label="Critical Events"  value={report.critical} total={report.total} color="#ef4444" bg="rgba(239,68,68,0.04)"    sub="Severe crash records" pulsing={report.critical > 0} />
        <MetricCard icon="⚡" label="Currently Active" value={report.active}   total={report.total} color="#f59e0b" bg="rgba(245,158,11,0.04)"   sub="Unresolved incidents"  pulsing={report.active > 0} />
        <MetricCard icon="✅" label="Resolved"          value={report.resolved} total={report.total} color="#10b981" bg="rgba(16,185,129,0.04)"  sub="Cleared or overridden" />
      </div>

      {/* ── Breakdown + Daily Chart + Sensor + Crash Control ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>

        {/* Incident Type Breakdown */}
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart3 size={16} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Incident Type Breakdown</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(STAGE_CONFIG).filter(([k]) => k !== 'UNKNOWN').map(([key, cfg]) => {
              const count = report.byStage[key] || 0;
              return <BreakdownBar key={key} icon={cfg.icon} label={cfg.label} count={count} total={report.total} color={cfg.color} />;
            })}
          </div>
        </div>

        {/* 7-day sparkline */}
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <TrendingUp size={16} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Incidents — Last 7 Days</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Daily incident frequency across all event types</div>
          <DailyChart daily={report.daily} />
          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> High (&gt;2)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /> Low (1–2)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.08)', display: 'inline-block' }} /> None
            </div>
          </div>
        </div>

        {/* Sensor Health + Crash Control combined */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <ScanLine size={15} color="var(--accent)" /> <span style={{ fontWeight: 800, fontSize: 13 }}>Sensor Health</span>
            </div>
            <SensorRow label="360° LIDAR Array"        online={true}  ping={2}  />
            <SensorRow label="V2X Radio"               online={true}  ping={8}  />
            <SensorRow label="GPS / GNSS"              online={true}  ping={42} />
            <SensorRow label="Crash Accelerometer"     online={true}  ping={1}  />
            <SensorRow label="Forward Collision Radar" online={true}  ping={3}  />
            <button
              onClick={runDiagnostics} disabled={diagRunning || crashActive}
              style={{ marginTop: 12, width: '100%', background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 10, padding: '9px 0', color: 'var(--text)', cursor: diagRunning ? 'default' : 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              <RefreshCw size={13} style={{ animation: diagRunning ? 'spin 1s linear infinite' : 'none' }} />
              {diagRunning ? `Running… ${diagProgress}%` : 'Run Full Diagnostics'}
            </button>
            {diagRunning && (
              <div style={{ marginTop: 6, height: 3, background: 'var(--panel-border)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${diagProgress}%` }} style={{ height: '100%', background: 'var(--accent)' }} />
              </div>
            )}
          </div>

          <div className="panel" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <ShieldAlert size={15} color="var(--danger)" /> <span style={{ fontWeight: 800, fontSize: 13 }}>Crash Control</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { l: 'System',  v: crashActive ? 'ESCALATING' : 'STANDBY', c: crashActive ? '#ef4444' : '#10b981' },
                { l: 'Stage',   v: crashStage || 'Monitoring',             c: crashActive ? '#f59e0b' : 'var(--text)' },
                { l: 'SOS in',  v: crashCountdown != null ? `${crashCountdown}s` : '—', c: crashActive ? '#ef4444' : 'var(--muted)' },
                { l: 'Sensors', v: '100% Online',                          c: '#10b981' },
              ].map(item => (
                <div key={item.l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{item.l}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: item.c }}>{item.v}</div>
                </div>
              ))}
            </div>
            <button onClick={handleSimulateImpact} disabled={crashActive}
              style={{ width: '100%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 10, padding: '9px 0', color: '#ef4444', cursor: crashActive ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: crashActive ? 0.5 : 1 }}>
              <AlertTriangle size={13} /> Simulate Impact
            </button>
            {crashActive && (
              <button onClick={handleCancelCrash} style={{ marginTop: 6, width: '100%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 10, padding: '9px 0', color: '#10b981', cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <CheckCircle size={13} /> Disarm — False Alarm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Escalation Timeline ────────────────────────────────────────── */}
      <div className="panel" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Clock size={15} color="var(--accent)" />
          <span style={{ fontWeight: 800, fontSize: 13 }}>SOS Escalation Timeline</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 6 }}>Stages triggered automatically if driver is unresponsive</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {[
            { stage: 'Impact Detected', time: '0s',   done: crashActive || false },
            { stage: 'WARNING',         time: '+10s',  done: ['WARNING','SMALL_CRASH','SEVERE_CRASH'].includes(crashStage) },
            { stage: 'SMALL_CRASH',     time: '+30s',  done: ['SMALL_CRASH','SEVERE_CRASH'].includes(crashStage) },
            { stage: 'SEVERE_CRASH',    time: '+60s',  done: crashStage === 'SEVERE_CRASH' },
            { stage: 'SOS Dispatched',  time: 'Auto',  done: false },
          ].map((step, i, arr) => (
            <React.Fragment key={step.stage}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 80 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: step.done ? '#ef4444' : 'var(--panel-border)', border: `2px solid ${step.done ? '#ef4444' : 'rgba(255,255,255,0.12)'}`, boxShadow: step.done ? '0 0 10px #ef4444' : 'none', transition: 'all 0.4s' }} />
                <div style={{ fontSize: 9, fontWeight: 700, color: step.done ? '#ef4444' : 'var(--muted)', textAlign: 'center' }}>{step.stage}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)' }}>{step.time}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ flex: 1, height: 2, background: step.done ? '#ef4444' : 'var(--panel-border)', marginTop: 5, transition: 'background 0.4s' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Incident Log Table ─────────────────────────────────────────── */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--panel-border)', padding: '0 20px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent', border: 'none', padding: '14px 18px', cursor: 'pointer',
                fontWeight: 700, fontSize: 13, color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 7
              }}>
              {tab.label}
              <span style={{
                background: activeTab === tab.id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${activeTab === tab.id ? 'rgba(59,130,246,0.3)' : 'var(--panel-border)'}`,
                borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 800
              }}>
                {tab.id === 'all' ? report.total : tab.id === 'active' ? report.active : report.resolved}
              </span>
            </button>
          ))}

          {/* Spacer + Controls */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                style={{ paddingLeft: 28, paddingRight: 8, paddingTop: 6, paddingBottom: 6, background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, outline: 'none', width: 150 }} />
            </div>
            <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}
              style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, padding: '6px 8px', outline: 'none', cursor: 'pointer' }}>
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="INFO">Info</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, padding: '6px 8px', outline: 'none', cursor: 'pointer' }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="severity">By Severity</option>
            </select>
          </div>
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '28px 120px 1fr 100px 140px 32px', gap: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.015)', borderBottom: '1px solid var(--panel-border)', fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          <div />
          <div>ID / Age</div>
          <div>Event / Description</div>
          <div>Severity</div>
          <div>Status</div>
          <div />
        </div>

        {/* Rows */}
        <div>
          {displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
              <Bell size={30} style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600 }}>No incidents match your filters</div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {displayed.map(alert => (
                <AlertRow key={alert.id} alert={alert} onExport={exportJson} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
          <span>Showing {displayed.length} of {alerts.length} total incidents{lastPollRef.current ? ` · Last refreshed ${timeAgo(lastPollRef.current.toISOString())}` : ''}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: liveMode ? '#10b981' : '#9ca3af', display: 'inline-block' }} />
            {liveMode ? 'Auto-refreshing every 15s' : 'Manual refresh only'}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
