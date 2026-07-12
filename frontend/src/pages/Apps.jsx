import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid, Globe, Download, CheckCircle2, Music, ShieldHalf, Zap,
  HeartPulse, Search, Eye, Wallet, Star, Play, X, Shield, Cpu,
  HardDrive, ChevronLeft, ChevronRight, RotateCw, Bookmark, Volume2,
  ListMusic, Pause, PlayCircle, Radio, Battery, Navigation, ShieldAlert,
  Coins, CreditCard, RefreshCw, Send, Check, Settings, Terminal, Bell, Plus, Flame
} from 'lucide-react';

const appCatalog = [
  {
    name: 'Spotify Drive',
    category: 'Media',
    desc: 'Immersive spatial audio optimized for exact cabin acoustics.',
    icon: Music,
    color: '#1DB954',
    rating: 4.9,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music'
  },
  {
    name: 'SentryGuard AI',
    category: 'Safety',
    desc: 'Real-time 360° AI anomaly detection & drone swarm dispatch.',
    icon: ShieldHalf,
    color: '#ef4444',
    rating: 4.8,
    playStoreUrl: 'https://play.google.com/store/search?q=dashcam+security+car&c=apps'
  },
  {
    name: 'ChargeMate Max',
    category: 'EV Utility',
    desc: 'Predictive thermal routing & peer-to-peer EV power sharing.',
    icon: Zap,
    color: '#f59e0b',
    rating: 4.7,
    playStoreUrl: 'https://play.google.com/store/search?q=EV+charging+stations&c=apps'
  },
  {
    name: 'CalmRide NLP',
    category: 'Wellness',
    desc: 'Biometric cabin adaptation using neural sentiment analysis.',
    icon: HeartPulse,
    color: '#8b5cf6',
    rating: 4.9,
    playStoreUrl: 'https://play.google.com/store/search?q=mindfulness+calm+health&c=apps'
  },
  {
    name: 'AR HUD Pro',
    category: 'Navigation',
    desc: 'Holographic V2X overlay of paths, hazards, and smart city signals.',
    icon: Eye,
    color: '#06b6d4',
    rating: 4.9,
    playStoreUrl: 'https://play.google.com/store/search?q=AR+navigation+HUD&c=apps'
  },
  {
    name: 'AutoPay Node',
    category: 'Financial',
    desc: 'Zero-click crypto infrastructure for tolls, drive-thrus, and charging.',
    icon: Wallet,
    color: '#10b981',
    rating: 4.6,
    playStoreUrl: 'https://play.google.com/store/search?q=crypto+wallet+payments&c=apps'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Apps() {
  const [installed, setInstalled] = useState(['Spotify Drive', 'AR HUD Pro']);
  const [installingApp, setInstallingApp] = useState(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [activeApp, setActiveApp] = useState(null);
  
  // Custom Sideloaded Apps state
  const [customApps, setCustomApps] = useState([]);
  const [sideloadOpen, setSideloadOpen] = useState(false);
  const [sideloadName, setSideloadName] = useState('');
  const [sideloadCategory, setSideloadCategory] = useState('Media');
  const [sideloadDesc, setSideloadDesc] = useState('');
  const [sideloadColor, setSideloadColor] = useState('#3b82f6');
  const [sideloadRating, setSideloadRating] = useState(4.5);

  // Sandbox access control permissions
  const [sandboxPermissions, setSandboxPermissions] = useState({
    lidar: true,
    gps: true,
    storage: true,
    network: true,
    cpuThrottled: false,
    ramThrottled: false
  });

  // Notifications drawer log
  const [notifications, setNotifications] = useState([
    { id: 1, text: "System sandbox policies successfully loaded.", time: "16:20:00" },
    { id: 2, text: "Automotive runtime engine verified: NexOS v1.4", time: "16:20:05" }
  ]);

  // Browser state
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
  const [inputValue, setInputValue] = useState('');
  const [browserHistory, setBrowserHistory] = useState(['https://www.google.com/webhp?igu=1']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [playStoreQuery, setPlayStoreQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Resource usage metrics
  const [cpuUsage, setCpuUsage] = useState({});
  const [ramUsage, setRamUsage] = useState({});

  // Combine default catalog with custom sideloaded apps
  const combinedCatalog = [...appCatalog, ...customApps];

  // Simulate dynamic resource usage + affect with sandbox limiters
  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = {};
      const newRam = {};
      installed.forEach(app => {
        const isActive = activeApp === app;
        const cpuLimit = sandboxPermissions.cpuThrottled ? 3 : 15;
        const ramLimit = sandboxPermissions.ramThrottled ? 45 : 110;

        newCpu[app] = isActive 
          ? Math.round(3 + Math.random() * (cpuLimit - 3)) 
          : Math.round(0.4 + Math.random() * 1.6);
        newRam[app] = isActive
          ? Math.round(60 + Math.random() * (ramLimit - 60))
          : Math.round(20 + Math.random() * 5);
      });
      setCpuUsage(newCpu);
      setRamUsage(newRam);
    }, 2000);
    return () => clearInterval(interval);
  }, [installed, activeApp, sandboxPermissions]);

  // App notification log dynamic simulator
  useEffect(() => {
    const interval = setInterval(() => {
      if (installed.length === 0) return;
      const running = installed[Math.floor(Math.random() * installed.length)];
      
      const eventPools = {
        'Spotify Drive': ['Synced audio cache with offline vault', 'Acoustic digital room alignment finished', 'High fidelity spatial render completed'],
        'SentryGuard AI': ['Heartbeat: 0 security violations detected', 'Payload: drone launcher pre-flight scan clear', 'V2X perimeter scan cleared'],
        'ChargeMate Max': ['Thermal pre-conditioning algorithm initialized', 'P2P grid trading handshake initialized', 'Dynamic range calculations verified'],
        'CalmRide NLP': ['Driver sentiment analyzed: Calm/Focused', 'Ambient cabin color therapy set to Forest', 'Low frequency white noise optimized'],
        'AR HUD Pro': ['Ocular HUD calibration finished', 'Forward warning lidar collision check complete', 'City traffic control speed limit mapped'],
        'AutoPay Node': ['Automated blockchain grid key check successful', 'NFC drive-thru toll handshake complete', 'Transaction cache successfully cleared']
      };

      const eventList = eventPools[running] || ['Background heartbeat check verified', 'Permissions index validated', 'Cache resources cleared'];
      const text = `${running}: ${eventList[Math.floor(Math.random() * eventList.length)]}`;
      
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setNotifications(prev => [{ id: Date.now(), text, time: timeStr }, ...prev.slice(0, 15)]);
    }, 6000);
    return () => clearInterval(interval);
  }, [installed]);

  // Install app animation simulator
  const startInstall = (app) => {
    if (installed.includes(app.name)) return;
    setInstallingApp(app.name);
    setInstallProgress(0);
    
    const duration = 2000; 
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const pct = Math.min(Math.round((currentStep / steps) * 100), 100);
      setInstallProgress(pct);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setInstalled(prev => [...prev, app.name]);
        setInstallingApp(null);
        setInstallProgress(0);
        
        // Add log notification
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setNotifications(prev => [{ id: Date.now(), text: `App Installed: ${app.name} is now ready to use.`, time: timeStr }, ...prev]);
      }
    }, intervalTime);
  };

  const uninstallApp = (appName) => {
    if (activeApp === appName) {
      setActiveApp(null);
    }
    setInstalled(prev => prev.filter(name => name !== appName));
  };

  const handleSideloadSubmit = (e) => {
    e.preventDefault();
    if (!sideloadName.trim() || !sideloadDesc.trim()) return;
    
    const newApp = {
      name: sideloadName.trim(),
      category: sideloadCategory,
      desc: sideloadDesc.trim(),
      icon: Terminal,
      color: sideloadColor,
      rating: parseFloat(sideloadRating),
      playStoreUrl: ''
    };

    setCustomApps(prev => [...prev, newApp]);
    setSideloadName('');
    setSideloadDesc('');
    setSideloadOpen(false);

    // Install immediately for developer testing comfort
    setInstalled(prev => [...prev, newApp.name]);

    // System notify
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setNotifications(prev => [{ id: Date.now(), text: `Sideload Successful: ${newApp.name} loaded to sandbox.`, time: timeStr }, ...prev]);
  };

  const handleNavigate = (e) => {
    if (e) e.preventDefault();
    let finalUrl = inputValue.trim();
    if (!finalUrl) return;

    if (!/^https?:\/\//i.test(finalUrl)) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}&igu=1`;
      }
    }

    const nextHistory = browserHistory.slice(0, historyIndex + 1);
    setBrowserHistory([...nextHistory, finalUrl]);
    setHistoryIndex(nextHistory.length);
    setUrl(finalUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setUrl(browserHistory[idx]);
      setInputValue(browserHistory[idx]);
    }
  };

  const goForward = () => {
    if (historyIndex < browserHistory.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setUrl(browserHistory[idx]);
      setInputValue(browserHistory[idx]);
    }
  };

  const handleBookmark = (bookmarkUrl) => {
    setInputValue(bookmarkUrl);
    const nextHistory = browserHistory.slice(0, historyIndex + 1);
    setBrowserHistory([...nextHistory, bookmarkUrl]);
    setHistoryIndex(nextHistory.length);
    setUrl(bookmarkUrl);
  };

  const handlePlayStoreSearch = (e) => {
    e.preventDefault();
    if (!playStoreQuery.trim()) return;
    window.open(`https://play.google.com/store/search?q=${encodeURIComponent(playStoreQuery.trim())}&c=apps`, '_blank');
  };

  const togglePermission = (key) => {
    setSandboxPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredApps = categoryFilter === 'All' 
    ? combinedCatalog 
    : combinedCatalog.filter(app => app.category === categoryFilter);

  return (
    <motion.div 
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      
      {/* ─── Top Level Controls & Filtering ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Grid size={24} color="var(--accent)" /> Applications Manager
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 13 }}>
            Manage dashboard integrations, system telemetry plugins, and onboard apps.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--panel-light)', padding: 4, borderRadius: 12, border: '1px solid var(--panel-border)' }}>
          {['All', 'Media', 'Safety', 'EV Utility', 'Wellness', 'Navigation', 'Financial'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: categoryFilter === cat ? 'var(--accent-glow)' : 'transparent',
                color: categoryFilter === cat ? 'var(--accent)' : 'var(--text)',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Interactive Application Sandbox / Workspace ─── */}
      <AnimatePresence>
        {activeApp && (
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="panel"
            style={{ 
              borderColor: 'var(--accent)', 
              boxShadow: '0 8px 32px var(--accent-glow)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Embedded Active App Interface header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', filter: 'drop-shadow(0 0 4px #10b981)' }} />
                <span style={{ fontWeight: 800, fontSize: 15 }}>Running: {activeApp}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 8 }}>
                  CPU: {cpuUsage[activeApp] || 0}% · RAM: {ramUsage[activeApp] || 0} MB
                </span>
              </div>
              <button 
                onClick={() => setActiveApp(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <X size={18} /> Minimize App
              </button>
            </div>

            {/* Render App Workspace based on name */}
            <div style={{ minHeight: 320 }}>
              {activeApp === 'Spotify Drive' && <SpotifyDriveWorkspace />}
              {activeApp === 'SentryGuard AI' && <SentryGuardWorkspace />}
              {activeApp === 'ChargeMate Max' && <ChargeMateWorkspace />}
              {activeApp === 'CalmRide NLP' && <CalmRideWorkspace />}
              {activeApp === 'AR HUD Pro' && <ArHudWorkspace />}
              {activeApp === 'AutoPay Node' && <AutoPayWorkspace />}
              
              {/* Fallback for sideloaded custom apps */}
              {!appCatalog.find(app => app.name === activeApp) && (
                <CustomSideloadWorkspace appName={activeApp} permissions={sandboxPermissions} />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── App Store and Local Catalog Grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        
        {/* Next-Gen App Ecosystem Grid */}
        <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Grid size={20} color="var(--accent)" /> System Apps
            </h2>
            <button
              onClick={() => setSideloadOpen(!sideloadOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3b82f6',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} /> Sideload Custom App
            </button>
          </div>

          {/* Sideload form collapsible portal */}
          <AnimatePresence>
            {sideloadOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 12,
                  border: '1px dashed rgba(255,255,255,0.1)',
                  padding: 16,
                  overflow: 'hidden'
                }}
              >
                <form onSubmit={handleSideloadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><Terminal size={14} color="var(--accent)" /> Sideload Developer Sandbox App</h4>
                    <button type="button" onClick={() => setSideloadOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={14} /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: 'var(--muted)' }}>App Name</label>
                      <input
                        value={sideloadName}
                        onChange={(e) => setSideloadName(e.target.value)}
                        placeholder="e.g. WeatherTerminal"
                        required
                        style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 6, color: '#fff', fontSize: 12 }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: 'var(--muted)' }}>Category</label>
                      <select
                        value={sideloadCategory}
                        onChange={(e) => setSideloadCategory(e.target.value)}
                        style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 6, color: '#fff', fontSize: 12 }}
                      >
                        {['Media', 'Safety', 'EV Utility', 'Wellness', 'Navigation', 'Financial'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, color: 'var(--muted)' }}>App Description</label>
                    <textarea
                      value={sideloadDesc}
                      onChange={(e) => setSideloadDesc(e.target.value)}
                      placeholder="Enter brief app scope..."
                      required
                      rows={2}
                      style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 6, color: '#fff', fontSize: 12, resize: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: 'var(--muted)' }}>Brand Color</label>
                      <input
                        type="color"
                        value={sideloadColor}
                        onChange={(e) => setSideloadColor(e.target.value)}
                        style={{ padding: '2px', background: 'transparent', border: 'none', height: 32, width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 11, color: 'var(--muted)' }}>Initial Rating</label>
                      <input
                        type="number"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={sideloadRating}
                        onChange={(e) => setSideloadRating(e.target.value)}
                        style={{ padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 6, color: '#fff', fontSize: 12 }}
                      />
                    </div>
                  </div>

                  <button type="submit" style={{ padding: '8px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer', marginTop: 4 }}>
                    Deploy Sandbox Application
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {filteredApps.map((app) => {
              const isInstalled = installed.includes(app.name);
              const isInstalling = installingApp === app.name;
              
              return (
                <motion.div 
                  className="card" 
                  key={app.name} 
                  style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 12, 
                    position: 'relative', 
                    overflow: 'hidden',
                    border: isInstalled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
                    background: activeApp === app.name ? 'var(--accent-glow)' : 'var(--panel-light)'
                  }}
                  whileHover={{ y: -4, boxShadow: `0 8px 30px ${app.color}15` }}
                >
                  {/* Blurry glow spot */}
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 80, height: 80, background: app.color, filter: 'blur(50px)', opacity: 0.25 }} />
                  
                  {/* App Title header */}
                  <div style={{ display: 'flex', gap: 12, zIndex: 1 }}>
                    <div style={{
                      width: 48, 
                      height: 48, 
                      borderRadius: 12, 
                      background: `linear-gradient(135deg, ${app.color} 0%, rgba(0,0,0,0.5) 150%)`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: `0 4px 12px ${app.color}30`, 
                      flexShrink: 0
                    }}>
                      <app.icon size={22} color="#fff" style={{ margin: 'auto' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--warning)', fontSize: 11, fontWeight: 700 }}>
                          {app.rating} <Star size={10} fill="currentColor" />
                        </div>
                      </div>
                      <div style={{ color: app.color, fontSize: 10, marginTop: 2, fontWeight: 600, letterSpacing: 0.5 }}>{app.category.toUpperCase()}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4, margin: 0, flex: 1, zIndex: 1 }}>
                    {app.desc}
                  </p>

                  {/* Resource metrics inline */}
                  {isInstalled && (
                    <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Cpu size={12} /> CPU: {cpuUsage[app.name] || 0}%</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HardDrive size={12} /> RAM: {ramUsage[app.name] || 0}MB</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ zIndex: 1, marginTop: 4 }}>
                    {isInstalling ? (
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                          <span>Downloading app...</span>
                          <span style={{ fontWeight: 700 }}>{installProgress}%</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                          <motion.div 
                            style={{ height: '100%', background: app.color }}
                            animate={{ width: `${installProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : isInstalled ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          className="primary" 
                          onClick={() => setActiveApp(app.name)}
                          style={{ flex: 1, padding: '6px 12px', fontSize: 12, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <Play size={12} fill="currentColor" /> Launch
                        </button>
                        <button 
                          onClick={() => uninstallApp(app.name)}
                          style={{ padding: '6px 10px', fontSize: 12, background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        className="primary"
                        onClick={() => startInstall(app)}
                        style={{ width: '100%', padding: '6px 12px', fontSize: 12, background: `linear-gradient(90deg, ${app.color}, rgba(0,0,0,0.5))`, border: 'none' }}
                      >
                        <Download size={14} /> Get App
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* App Sandbox Security Access Controls */}
          <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
              <Shield size={16} color="var(--accent)" /> Sandbox Permissions
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)', lineHeight: 1.3 }}>
              Toggle global restrictions for sideloaded and system applications.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {[
                { label: 'Camera & Lidar Oculars', key: 'lidar' },
                { label: 'GPS / Navigation Telemetry', key: 'gps' },
                { label: 'Local VMS Storage Cache', key: 'storage' },
                { label: 'V2X Network Broadcast', key: 'network' }
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12 }}>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={sandboxPermissions[item.key]}
                    onChange={() => togglePermission(item.key)}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>RESOURCE THROTTLING</span>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Cpu size={12} /> Cpu Limiter (Max 3%)</span>
                <input
                  type="checkbox"
                  checked={sandboxPermissions.cpuThrottled}
                  onChange={() => togglePermission('cpuThrottled')}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><HardDrive size={12} /> Ram Limiter (Max 45MB)</span>
                <input
                  type="checkbox"
                  checked={sandboxPermissions.ramThrottled}
                  onChange={() => togglePermission('ramThrottled')}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                />
              </div>
            </div>
          </motion.section>

          {/* Sandbox Resource Telemetry */}
          <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
              <Cpu size={16} color="var(--accent)" /> Sandbox Telemetry
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                  <span>Core Sandbox CPU</span>
                  <span>
                    {Object.values(cpuUsage).reduce((a, b) => a + b, 0).toFixed(1)}% / {sandboxPermissions.cpuThrottled ? '5%' : '25%'}
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: 'var(--accent)', 
                    width: `${Math.min(100, (Object.values(cpuUsage).reduce((a, b) => a + b, 0) / (sandboxPermissions.cpuThrottled ? 5 : 25)) * 100)}%` 
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                  <span>App Cache RAM</span>
                  <span>
                    {Object.values(ramUsage).reduce((a, b) => a + b, 0)} MB / {sandboxPermissions.ramThrottled ? '256 MB' : '1024 MB'}
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: '#10b981', 
                    width: `${Math.min(100, (Object.values(ramUsage).reduce((a, b) => a + b, 0) / (sandboxPermissions.ramThrottled ? 256 : 1024)) * 100)}%` 
                  }} />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Dynamic App Notifications Log Drawer */}
          <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
              <Bell size={16} color="var(--warning)" /> Sandbox Log Drawer
            </h3>
            <div style={{
              background: '#070708',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              height: 140,
              overflowY: 'auto'
            }}>
              {notifications.map(notif => (
                <div key={notif.id} style={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 10, borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                    <span>SYSTEM EVENT</span>
                    <span>{notif.time}</span>
                  </div>
                  <span style={{ color: '#fff', fontSize: 11 }}>{notif.text}</span>
                </div>
              ))}
            </div>
          </motion.section>

        </div>
      </div>

      {/* ─── Fully Functional CyberBrowser ─── */}
      <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Globe size={20} color="var(--accent-2)" /> Onboard CyberBrowser
          </h2>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            Sandboxed Multi-Source Web View
          </span>
        </div>

        {/* Browser Tool Bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button 
              onClick={goBack} 
              disabled={historyIndex <= 0} 
              style={{ padding: 8, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: historyIndex <= 0 ? 'rgba(255,255,255,0.1)' : '#fff', cursor: 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={goForward} 
              disabled={historyIndex >= browserHistory.length - 1} 
              style={{ padding: 8, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: historyIndex >= browserHistory.length - 1 ? 'rgba(255,255,255,0.1)' : '#fff', cursor: 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => { const current = url; setUrl(''); setTimeout(() => setUrl(current), 50); }}
              style={{ padding: 8, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}
            >
              <RotateCw size={16} />
            </button>
          </div>

          <form onSubmit={handleNavigate} style={{ display: 'flex', flex: 1, position: 'relative', alignItems: 'center' }}>
            <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: 12 }} />
            <input
              className="url-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search Google or enter URL (e.g. wikipedia.org)"
              style={{
                paddingLeft: 36,
                paddingRight: 60,
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                borderColor: 'var(--panel-border)',
                color: '#fff',
                fontSize: 13,
                borderRadius: 10,
                height: 36
              }}
            />
            <button 
              type="submit" 
              style={{ 
                position: 'absolute', 
                right: 4, 
                padding: '4px 12px', 
                background: 'var(--accent)', 
                color: '#000', 
                fontWeight: 700, 
                border: 'none', 
                borderRadius: 6, 
                fontSize: 11, 
                cursor: 'pointer' 
              }}
            >
              Go
            </button>
          </form>

          {/* Quick Bookmarks */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'Google', url: 'https://www.google.com/webhp?igu=1' },
              { label: 'Wiki', url: 'https://en.wikipedia.org/wiki/Main_Page' },
              { label: 'NASA', url: 'https://www.nasa.gov/' },
              { label: 'Bing', url: 'https://www.bing.com' }
            ].map(bm => (
              <button
                key={bm.label}
                onClick={() => handleBookmark(bm.url)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 8,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <Bookmark size={10} /> {bm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real browser frame */}
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', height: 480, position: 'relative' }}>
          {url ? (
            <iframe 
              src={url} 
              title="Browser Sandbox" 
              style={{ background: '#fff', border: 'none', width: '100%', height: '100%' }} 
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0a0a0a', color: 'var(--muted)' }}>
              Loading page...
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ─── RUNNING APP WORKSPACES (HIGH FIDELITY MOCKS) ─────────────────────────────
// ──────────────────────────────────────────────────────────────────────────────

// 1. Spotify Drive Workspace
function SpotifyDriveWorkspace() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playTime, setPlayTime] = useState(84);
  const [volume, setVolume] = useState(70);

  const playlist = [
    { title: 'Cyberpunk Drive (Midnight mix)', artist: 'Ghost Synth', duration: 218 },
    { title: 'Neon Highway', artist: 'Hyperion', duration: 184 },
    { title: 'Liquid Velocity', artist: 'Acoustic Shift', duration: 260 },
    { title: 'Autonomic Cabin', artist: 'Hologram Room', duration: 195 }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayTime(t => {
        if (t >= playlist[currentTrack].duration) {
          setCurrentTrack(c => (c + 1) % playlist.length);
          return 0;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24, padding: 10 }}>
      {/* Media Cover & Player Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 16 }}>
        <div style={{ 
          width: 140, 
          height: 140, 
          borderRadius: 16, 
          background: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(29, 185, 84, 0.3)'
        }}>
          <Radio size={48} color="#fff" style={{ opacity: 0.8 }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '8px 0 2px 0', fontSize: 16, fontWeight: 800 }}>{playlist[currentTrack].title}</h4>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{playlist[currentTrack].artist}</span>
        </div>

        {/* Dynamic Spectrum EQ Visualizer */}
        <div style={{ display: 'flex', gap: 3, height: 32, alignItems: 'flex-end', margin: '8px 0' }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              style={{ width: 3, background: '#1DB954', borderRadius: 2 }}
              animate={isPlaying ? { height: [6, 12 + Math.random() * 20, 6] } : { height: 6 }}
              transition={{ repeat: Infinity, duration: 0.8 + Math.random() * 0.8, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Progress Slider */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                background: '#1DB954', 
                width: `${(playTime / playlist[currentTrack].duration) * 100}%` 
              }} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
            <span>{formatTime(playTime)}</span>
            <span>{formatTime(playlist[currentTrack].duration)}</span>
          </div>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => { setCurrentTrack(c => (c - 1 + playlist.length) % playlist.length); setPlayTime(0); }}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ background: '#1DB954', border: 'none', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {isPlaying ? <Pause size={20} color="#000" /> : <PlayCircle size={20} color="#000" />}
          </button>
          <button 
            onClick={() => { setCurrentTrack(c => (c + 1) % playlist.length); setPlayTime(0); }}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginTop: 8 }}>
          <Volume2 size={14} color="var(--muted)" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            style={{ flex: 1, accentColor: '#1DB954', height: 4 }}
          />
          <span style={{ fontSize: 10, color: 'var(--muted)', width: 24 }}>{volume}%</span>
        </div>
      </div>

      {/* Playlist tracks selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ margin: 0, fontSize: 14, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ListMusic size={16} /> Drive Playlist Selection
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {playlist.map((track, idx) => (
            <div 
              key={idx} 
              onClick={() => { setCurrentTrack(idx); setPlayTime(0); setIsPlaying(true); }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 12,
                background: currentTrack === idx ? 'rgba(29, 185, 84, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: `1.5px solid ${currentTrack === idx ? '#1DB954' : 'rgba(255, 255, 255, 0.05)'}`,
                cursor: 'pointer',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: currentTrack === idx ? '#1DB954' : '#fff' }}>{track.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{track.artist}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{formatTime(track.duration)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. SentryGuard AI Workspace
function SentryGuardWorkspace() {
  const [status, setStatus] = useState('Armed');
  const [logs, setLogs] = useState([
    { time: '16:15:32', type: 'info', msg: 'SentryGuard AI System initialized successfully' },
    { time: '16:16:10', type: 'info', msg: 'Perimeter scanning active. 0 threats detected' }
  ]);
  const [droneCount, setDroneCount] = useState(0);
  const [dispatching, setDispatching] = useState(false);

  const dispatchDrones = () => {
    if (dispatching) return;
    setDispatching(true);
    setStatus('Drone Swarm Active');
    
    setLogs(prev => [
      { time: '16:20:00', type: 'warning', msg: 'Simulated dispatch request received' },
      ...prev
    ]);

    setTimeout(() => {
      setDroneCount(4);
      setLogs(prev => [
        { time: '16:20:02', type: 'success', msg: '4 autonomous guard drones deployed to security perimeter' },
        ...prev
      ]);
      setDispatching(false);
    }, 2000);
  };

  const resetSentry = () => {
    setDroneCount(0);
    setStatus('Armed');
    setLogs([
      { time: '16:21:40', type: 'info', msg: 'Swarm returned to chassis payload' },
      { time: '16:15:32', type: 'info', msg: 'SentryGuard AI System initialized successfully' }
    ]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 10 }}>
      {/* Surveillance Camera grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h4 style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>Live Surveillance Matrix</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {['CAM 1 - Front Radar', 'CAM 2 - Rear Thermal', 'CAM 3 - Side Left Ocular', 'CAM 4 - Drone Swarm Hub'].map((cam, i) => (
            <div key={i} style={{ 
              height: 90, 
              background: '#070708', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 6px 100%',
                zIndex: 2,
                pointerEvents: 'none'
              }} />
              <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4, zIndex: 3 }}>
                <span style={{ 
                  width: 6, height: 6, borderRadius: '50%', background: '#ef4444', 
                  animation: 'spin 1s ease infinite alternate'
                }} />
                <span style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 800 }}>LIVE</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--muted)', zIndex: 1 }}>{cam}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>SENTRY INTEGRITY STATUS</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: status === 'Armed' ? '#10b981' : '#f59e0b' }}>
              🛡️ {status.toUpperCase()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>DRONES DEPLOYED</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ef4444' }}>{droneCount} / 4</div>
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          background: '#070708', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: 8, 
          padding: 10, 
          fontFamily: 'monospace', 
          fontSize: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          maxHeight: 120,
          overflowY: 'auto'
        }}>
          {logs.map((log, idx) => (
            <div key={idx} style={{ color: log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : '#a1a1aa' }}>
              [{log.time}] {log.msg}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className="primary"
            onClick={dispatchDrones}
            disabled={droneCount > 0 || dispatching}
            style={{ 
              flex: 1, 
              background: '#ef4444', 
              color: '#fff', 
              border: 'none', 
              padding: '10px', 
              borderRadius: 8, 
              fontWeight: 700, 
              cursor: (droneCount > 0 || dispatching) ? 'not-allowed' : 'pointer'
            }}
          >
            {dispatching ? 'Launching Swarm...' : '⚡ Trigger Drone Dispatch'}
          </button>
          {droneCount > 0 && (
            <button 
              onClick={resetSentry}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer' }}
            >
              Recall Swarm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. ChargeMate Max Workspace
function ChargeMateWorkspace() {
  const [thermalProfile, setThermalProfile] = useState('Standard');
  const [sharePower, setSharePower] = useState(false);
  const [shareLimit, setShareLimit] = useState(25);

  const ToggleSwitchLocal = ({ checked, onChange }) => (
    <div onClick={() => onChange(!checked)} style={{
      width: 36, height: 20, borderRadius: 10,
      background: checked ? '#f59e0b' : 'rgba(255,255,255,0.1)',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.3s'
    }}>
      <div style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.3s'
      }} />
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, padding: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h4 style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>CyberCab Charging Optimizer</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontSize: 11, fontWeight: 700 }}>
              <Battery size={16} /> CORE HEALTH
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>98.2%</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Excellent Thermal Level</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 11, fontWeight: 700 }}>
              <Zap size={16} /> MAX INPUT
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>350 kW</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Active Liquid Cooling</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>PREDICTIVE ROUTING THERMAL CONDITIONING</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Standard', 'Pre-Cooling', 'Supercharge Ready'].map(mode => (
              <button
                key={mode}
                onClick={() => setThermalProfile(mode)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  background: thermalProfile === mode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${thermalProfile === mode ? '#f59e0b' : 'rgba(255,255,255,0.05)'}`,
                  color: thermalProfile === mode ? '#f59e0b' : 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>P2P Power Sharing</h4>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Sell charge to nearby vehicles</span>
          </div>
          <ToggleSwitchLocal checked={sharePower} onChange={setSharePower} />
        </div>

        <div style={{ opacity: sharePower ? 1 : 0.4, transition: 'all 0.3s', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span>Maximum Output Cap</span>
            <span style={{ fontWeight: 800, color: '#f59e0b' }}>{shareLimit} kW</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="150" 
            step="5"
            value={shareLimit}
            disabled={!sharePower}
            onChange={(e) => setShareLimit(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#f59e0b' }}
          />
          <div style={{ fontSize: 10, color: 'var(--muted)', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: 8, lineHeight: 1.4 }}>
            💡 Shared energy is auto-settled over the VMS Blockchain Grid immediately upon link teardown.
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. CalmRide NLP Workspace
function CalmRideWorkspace() {
  const [sentiment, setSentiment] = useState('Relaxed');
  const [cabinGlow, setCabinGlow] = useState('#8b5cf6');
  const [ambientAudio, setAmbientAudio] = useState(true);

  const ToggleSwitchLocal = ({ checked, onChange }) => (
    <div onClick={() => onChange(!checked)} style={{
      width: 36, height: 20, borderRadius: 10,
      background: checked ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.3s'
    }}>
      <div style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.3s'
      }} />
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24, padding: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h4 style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>Biometric Cabin Adapters</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>DRIVER CLASSIFIED MOOD STATE</span>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: 8 }}>
            🧘 {sentiment.toUpperCase()}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['Relaxed', 'Focused', 'Energetic'].map(mode => (
            <button
              key={mode}
              onClick={() => setSentiment(mode)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                background: sentiment === mode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${sentiment === mode ? '#8b5cf6' : 'rgba(255,255,255,0.05)'}`,
                color: sentiment === mode ? '#8b5cf6' : 'var(--text)',
                cursor: 'pointer'
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Adaptive White Noise</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Play cabin frequencies (Hertz)</div>
          </div>
          <ToggleSwitchLocal checked={ambientAudio} onChange={setAmbientAudio} />
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>RGB Ambient Color Therapy</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[
            { color: '#8b5cf6', name: 'Lavender Calm' },
            { color: '#3b82f6', name: 'Deep Ocean' },
            { color: '#10b981', name: 'Zen Forest' },
            { color: '#f59e0b', name: 'Sunset Glow' },
            { color: '#ef4444', name: 'Ruby Focus' }
          ].map(item => (
            <button
              key={item.color}
              onClick={() => setCabinGlow(item.color)}
              title={item.name}
              style={{
                height: 48,
                background: item.color,
                border: cabinGlow === item.color ? '3px solid #fff' : 'none',
                borderRadius: 8,
                cursor: 'pointer',
                boxShadow: cabinGlow === item.color ? `0 0 16px ${item.color}` : 'none',
                transition: 'all 0.2s'
              }}
            />
          ))}
        </div>
        <div style={{ 
          height: 60, 
          borderRadius: 8, 
          background: `linear-gradient(135deg, ${cabinGlow}30, ${cabinGlow}05)`,
          border: `1.5px solid ${cabinGlow}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          color: cabinGlow,
          fontWeight: 700
        }}>
          💡 Active Cabin Lighting Gradient: {cabinGlow}
        </div>
      </div>
    </div>
  );
}

// 5. AR HUD Pro Workspace
function ArHudWorkspace() {
  const [hudState, setHudState] = useState(true);
  const [hazards, setHazards] = useState(0);

  const ToggleSwitchLocal = ({ checked, onChange }) => (
    <div onClick={() => onChange(!checked)} style={{
      width: 36, height: 20, borderRadius: 10,
      background: checked ? '#06b6d4' : 'rgba(255,255,255,0.1)',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.3s'
    }}>
      <div style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.3s'
      }} />
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, padding: 10 }}>
      <div style={{ 
        height: 180, 
        background: '#070708', 
        borderRadius: 12, 
        border: '1.5px solid rgba(6, 182, 212, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.15) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          zIndex: 1
        }} />

        <div style={{ zIndex: 2, textAlign: 'center', color: '#06b6d4' }}>
          <div style={{ fontSize: 10, letterSpacing: 1, fontWeight: 700 }}>AR HUD PROJECTION</div>
          <div style={{ fontSize: 44, fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>
            {hudState ? '68' : '0'}
            <span style={{ fontSize: 14, fontWeight: 500, marginLeft: 2 }}>KM/H</span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(6, 182, 212, 0.8)', marginTop: 4 }}>
            🎯 Geofence Target: LOCKED
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 10, left: '20%', right: '20%', height: 40,
          borderLeft: '2px dashed rgba(6,182,212,0.6)',
          borderRight: '2px dashed rgba(6,182,212,0.6)',
          zIndex: 2
        }} />

        {hazards > 0 && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3
          }}>
            <span style={{ color: '#ef4444', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              🚨 HAZARD WARNING: VEHICLE DETECTED
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Holographic Overlay</h4>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Project pathing signals on dashboard</span>
          </div>
          <ToggleSwitchLocal checked={hudState} onChange={setHudState} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>AR HUD INCIDENT TESTING</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setHazards(1)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer'
              }}
            >
              Simulate Threat Warning
            </button>
            {hazards > 0 && (
              <button
                onClick={() => setHazards(0)}
                style={{
                  padding: '10px 8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontSize: 11, cursor: 'pointer'
                }}
              >
                Clear Alert
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. AutoPay Node Workspace
function AutoPayWorkspace() {
  const [balance, setBalance] = useState(142.50);
  const [autoTolls, setAutoTolls] = useState(true);
  const [autoCharging, setAutoCharging] = useState(true);
  const [logs, setLogs] = useState([
    { id: 1, type: 'Toll Gate', amount: '1.20', date: 'Jul 12, 14:02' },
    { id: 2, type: 'FastCharge', amount: '18.40', date: 'Jul 12, 11:45' }
  ]);
  const [paying, setPaying] = useState(false);

  const ToggleSwitchLocal = ({ checked, onChange }) => (
    <div onClick={() => onChange(!checked)} style={{
      width: 36, height: 20, borderRadius: 10,
      background: checked ? '#10b981' : 'rgba(255,255,255,0.1)',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.3s'
    }}>
      <div style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.3s'
      }} />
    </div>
  );

  const simulatePayment = () => {
    if (paying) return;
    setPaying(true);
    setTimeout(() => {
      const amt = (2.50 + Math.random() * 5).toFixed(2);
      setBalance(b => Math.max(0, parseFloat((b - parseFloat(amt)).toFixed(2))));
      setLogs(prev => [
        { id: Date.now(), type: 'NFC City Toll', amount: amt, date: 'Jul 12, 16:18' },
        ...prev
      ]);
      setPaying(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h4 style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>CyberCab Cryptographic Node</h4>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 11, fontWeight: 700 }}>
            <Coins size={16} /> ONBOARD BALANCE
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {balance.toFixed(2)} <span style={{ fontSize: 12, color: 'var(--muted)' }}>FLT</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>RECENT SETTLED TRANSACTIONS</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 110, overflowY: 'auto' }}>
            {logs.map(log => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: 11 }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{log.type}</span>
                  <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{log.date}</span>
                </div>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>-{log.amount} FLT</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Onboard Auto-Pay Switches</h4>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12 }}>Auto-Pay Highway Tolls</span>
          <ToggleSwitchLocal checked={autoTolls} onChange={setAutoTolls} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12 }}>Auto-Pay EV Chargers</span>
          <ToggleSwitchLocal checked={autoCharging} onChange={setAutoCharging} />
        </div>

        <button 
          onClick={simulatePayment}
          disabled={paying}
          style={{
            marginTop: 8,
            padding: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12,
            cursor: paying ? 'not-allowed' : 'pointer'
          }}
        >
          {paying ? 'Authorizing Payment...' : '💳 Simulate NFC Toll Payment'}
        </button>
      </div>
    </div>
  );
}

// 7. Custom Developer Sideload Workspace
function CustomSideloadWorkspace({ appName, permissions }) {
  const [consoleLogs, setConsoleLogs] = useState([
    { text: `SYSTEM: Initializing ${appName} sandbox environment...`, type: 'system' },
    { text: `SYSTEM: Permissions checked - GPS: ${permissions.gps ? 'YES' : 'NO'}, Lidar: ${permissions.lidar ? 'YES' : 'NO'}, Net: ${permissions.network ? 'YES' : 'NO'}`, type: 'system' },
    { text: `SYSTEM: Sandbox ready. Type /help to see all testing options.`, type: 'info' }
  ]);
  const [cmdInput, setCmdInput] = useState('');
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = cmdInput.trim();
    if (!cmd) return;

    const newLogs = [...consoleLogs, { text: `user@nexos:~ $ ${cmd}`, type: 'input' }];
    setCmdInput('');

    const addLog = (text, type = 'output') => {
      newLogs.push({ text, type });
      setConsoleLogs([...newLogs]);
    };

    if (cmd.startsWith('/help')) {
      addLog('Available Commands:', 'info');
      addLog('  /help             Display dev tools CLI help');
      addLog('  /sysinfo          Show active sandbox hardware state & permissions');
      addLog('  /ping             Compute real-time latency handshake');
      addLog('  /network          Broadcast dynamic test payload across V2X Grid');
      addLog('  /diagnostic       Execute full application threat sweep');
      addLog('  /clear            Clear the developer logs monitor');
    } else if (cmd.startsWith('/clear')) {
      setConsoleLogs([{ text: `Logs cleared. Sideload environment is active.`, type: 'system' }]);
      return;
    } else if (cmd.startsWith('/sysinfo')) {
      addLog(`App Namespace: sandbox.${appName.toLowerCase().replace(/\s+/g, '')}`, 'output');
      addLog(`Allocated CPU quota: ${permissions.cpuThrottled ? '3% MAX' : '25% MAX'}`, 'output');
      addLog(`Allocated RAM quota: ${permissions.ramThrottled ? '45MB MAX' : '1024MB MAX'}`, 'output');
      addLog(`Hardware Channels: [Lidar: ${permissions.lidar ? 'ON' : 'OFF'}], [GPS: ${permissions.gps ? 'ON' : 'OFF'}], [V2X Network: ${permissions.network ? 'ON' : 'OFF'}]`, 'output');
    } else if (cmd.startsWith('/ping')) {
      addLog('Pinging NexFleet central vehicle registry...', 'system');
      setTimeout(() => {
        addLog(`Reply from 127.0.0.1: bytes=64 time=${Math.round(8 + Math.random() * 14)}ms TTL=64`, 'success');
      }, 500);
    } else if (cmd.startsWith('/network')) {
      if (!permissions.network) {
        addLog('ERROR: V2X Network permission is blocked by Sandbox policies.', 'error');
      } else {
        addLog('Broadcasting test beacon to surrounding CyberCabs...', 'system');
        setTimeout(() => {
          addLog('V2X Broadcast success: 3 peers acknowledged handshake beacon.', 'success');
        }, 800);
      }
    } else if (cmd.startsWith('/diagnostic')) {
      addLog('Starting full application memory leak check & integrity scan...', 'system');
      setTimeout(() => {
        addLog('[✔] Clean memory layout. 0 leaks.', 'success');
        addLog('[✔] Lidar access tokens verified.', 'success');
        addLog('[✔] App signature verification: DEVELOPER TEST BUILD OK.', 'success');
      }, 1000);
    } else {
      addLog(`Unknown command: "${cmd}". Type /help for options.`, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 10 }}>
      <div>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Terminal size={16} color="var(--accent)" /> Sandbox Sideload Terminal Workspace
        </h4>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Test custom applications dynamically in the secure NexFleet sandbox</span>
      </div>

      {/* Terminal log panel */}
      <div style={{
        height: 200,
        background: '#070708',
        border: '1.5px solid var(--panel-border)',
        borderRadius: 10,
        padding: '12px 16px',
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#10b981',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
        {consoleLogs.map((log, idx) => (
          <div 
            key={idx} 
            style={{ 
              color: log.type === 'system' ? '#06b6d4' : log.type === 'error' ? '#ef4444' : log.type === 'success' ? '#10b981' : log.type === 'info' ? '#f59e0b' : '#fff'
            }}
          >
            {log.text}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Command prompt form */}
      <form onSubmit={handleCommandSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          placeholder="Type command (e.g. /help, /sysinfo, /ping, /diagnostic)..."
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--panel-border)',
            borderRadius: 8,
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: 12
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '0 16px',
            background: 'var(--accent)',
            color: '#000',
            fontWeight: 700,
            borderRadius: 8,
            border: 'none',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          Send Command
        </button>
      </form>
    </div>
  );
}
