import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bell,
  Car,
  ChevronRight,
  Gauge,
  Globe,
  MapPin,
  Monitor,
  Moon,
  Radio,
  ShieldCheck,
  Smartphone,
  Sun,
  Wrench,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import "../styles/landing.css";

/* ── Custom Social Icons (replacing missing lucide-react brand icons) ── */
const Github = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Twitter = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ── Data ─────────────────────────────────────────────────────── */

const stats = [
  { value: "10k+",  label: "Vehicle events processed" },
  { value: "99.9%", label: "Telemetry uptime" },
  { value: "24/7",  label: "Fleet visibility" },
  { value: "38%",   label: "Faster service response" },
];

const features = [
  {
    index: 0,
    icon: MapPin,
    title: "Live GPS Telemetry",
    desc: "Track location, speed, and route behavior in one command view. Real-time updates every 2 seconds.",
    color: "#2563eb",
  },
  {
    index: 1,
    icon: Wrench,
    title: "Predictive Service Alerts",
    desc: "Surface maintenance risk before it turns into vehicle downtime. Stay ahead of every issue.",
    color: "#0891b2",
  },
  {
    index: 2,
    icon: ShieldCheck,
    title: "3-Stage Crash Detection",
    desc: "Monitor incident stages and trigger diagnostics from the console. SOS auto-dispatch included.",
    color: "#10b981",
  },
  {
    index: 3,
    icon: Gauge,
    title: "Fleet Health Analytics",
    desc: "Compare battery, fuel, cabin, and tyre data with consistent live signals and auto-sync.",
    color: "#f97316",
  },
  {
    index: 4,
    icon: Bell,
    title: "Driver-Ready Reports",
    desc: "Keep operations, safety, and service updates readable at a glance on any screen.",
    color: "#8b5cf6",
  },
  {
    index: 5,
    icon: Car,
    title: "Connected Vehicle Controls",
    desc: "Manage live mode, cabin security, and link status — WiFi, Bluetooth, GPS — from one place.",
    color: "#f59e0b",
  },
];

const modules = [
  {
    label: "Navigation",
    title: "GPS & Route Tracking",
    desc: "Real-time map with OpenStreetMap, live coordinates, speed tracking, and heading simulation.",
    icon: MapPin,
    emoji: "🗺️",
    color: "rgba(37,99,235,0.15)",
  },
  {
    label: "Safety",
    title: "Crash Alert System",
    desc: "3-stage escalation: Warning → Crash → SOS. Auto-dispatches police & hospital with coordinates.",
    icon: ShieldCheck,
    emoji: "🛡️",
    color: "rgba(239,68,68,0.15)",
  },
  {
    label: "Media",
    title: "Infotainment Suite",
    desc: "Full-width video player, music playlist, volume controls, simulated Play Store & browser.",
    icon: Monitor,
    emoji: "🎵",
    color: "rgba(139,92,246,0.15)",
  },
];

const testimonials = [
  [
    {
      stars: 5,
      text: "\"NexFleet completely transformed how we manage our fleet. Real-time telemetry and crash alerts are game-changers for our operations.\"",
      name: "Arjun Sharma",
      role: "Fleet Manager, TechCorp",
      initial: "A",
    },
    {
      stars: 5,
      text: "\"The 3-stage crash detection system is brilliant. It gives drivers time to respond before emergency services are dispatched automatically.\"",
      name: "Priya Nair",
      role: "Safety Director, LogiCo",
      initial: "P",
    },
  ],
  [
    {
      stars: 5,
      text: "\"Predictive maintenance alerts saved us thousands. We catch issues before they become breakdowns. The ROI is incredible.\"",
      name: "Rahul Verma",
      role: "Operations Lead, AutoFleet",
      initial: "R",
    },
    {
      stars: 5,
      text: "\"The Tesla-style dark dashboard is stunning and the live GPS tracking is incredibly accurate. Perfect for modern fleet management.\"",
      name: "Meera Iyer",
      role: "Tech Lead, SmartDrive",
      initial: "M",
    },
  ],
];

const trustBadges = [
  { icon: "🔒", label: "Firebase Auth" },
  { icon: "🗺️", label: "OpenStreetMap" },
  { icon: "☕", label: "Spring Boot" },
  { icon: "⚛️", label: "React + Vite" },
  { icon: "🐬", label: "MySQL Database" },
  { icon: "📡", label: "REST API" },
  { icon: "🛡️", label: "Crash Detection" },
  { icon: "📍", label: "Live GPS" },
  { icon: "🔒", label: "Firebase Auth" },
  { icon: "🗺️", label: "OpenStreetMap" },
  { icon: "☕", label: "Spring Boot" },
  { icon: "⚛️", label: "React + Vite" },
  { icon: "🐬", label: "MySQL Database" },
  { icon: "📡", label: "REST API" },
  { icon: "🛡️", label: "Crash Detection" },
  { icon: "📍", label: "Live GPS" },
];

const barHeights = [42, 72, 58, 88, 64, 76, 50];

/* ── Scroll Reveal Hook ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Navbar scroll effect ───────────────────────────────────── */
function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/* ── Workflow Steps Data ─────────────────────────────────────── */
const workflowSteps = [
  {
    num: "01",
    title: "Connect Vehicles",
    desc: "Log in with Firebase auth, link your vehicles via VIN, and the system starts syncing telemetry automatically.",
    detail: "Secure authentication and vehicle registration is the gateway to all NexFleet intelligence. Each vehicle is uniquely identified by VIN and linked to the operator's account.",
    steps: [
      { icon: "🔐", title: "Firebase Authentication", desc: "Google OAuth or email/password sign-in via Firebase Auth. Session tokens are persisted securely in browser storage." },
      { icon: "🚗", title: "VIN Registration", desc: "Register vehicles by VIN, plate number, make, model, and year. Each vehicle gets a unique ID in the MySQL database." },
      { icon: "🔄", title: "Auto Telemetry Sync", desc: "Once registered, the Spring Boot backend immediately starts accepting live telemetry POSTs from the React frontend every 2–15 seconds." },
      { icon: "📡", title: "CORS & API Handshake", desc: "All API calls go through Axios with configurable VITE_API_BASE_URL, enabling seamless switch between local and live deployments." },
    ],
    badges: [
      { label: "Firebase Auth", color: "orange" },
      { label: "Spring Boot", color: "green" },
      { label: "MySQL", color: "blue" },
      { label: "Axios", color: "cyan" },
      { label: "React", color: "blue" },
    ],
  },
  {
    num: "02",
    title: "Monitor Live Signals",
    desc: "Watch real-time GPS, fuel, tyre pressure, cabin temperature, and connectivity status update every few seconds.",
    detail: "The monitoring layer continuously reads sensor simulation values, streams them to the backend, and renders them on the dashboard with animated visualisations.",
    steps: [
      { icon: "📍", title: "GPS Live Tracking", desc: "Browser Geolocation API feeds into OpenStreetMap via React Leaflet. GPS coordinates are posted to /api/locations every 2 seconds in Live Mode." },
      { icon: "⚡", title: "Telemetry Simulator", desc: "AppContext runs a smooth interpolation engine (getNextStats) that fluctuates fuel, tyre pressure, cabin temp, and mileage realistically every 5 seconds." },
      { icon: "📶", title: "Connectivity Signals", desc: "WiFi, Bluetooth, and GPS connectivity are simulated with probabilistic state flips. Their status is reflected instantly in the TopBar and Connectivity page." },
      { icon: "📊", title: "Dashboard Rendering", desc: "All live values feed into animated stat cards, radial gauges, and live map markers. Component re-renders are optimised with useMemo and useCallback." },
    ],
    badges: [
      { label: "React Leaflet", color: "green" },
      { label: "Live Mode", color: "blue" },
      { label: "OpenStreetMap", color: "cyan" },
      { label: "Spring Boot API", color: "green" },
      { label: "useMemo", color: "purple" },
    ],
  },
  {
    num: "03",
    title: "Act on Alerts",
    desc: "Receive staged crash alerts, predictive maintenance warnings, and resolve them directly from the console.",
    detail: "The alert system is a 3-stage escalation pipeline that simulates real-world crash detection. Each stage triggers different UI, timers, and backend logging.",
    steps: [
      { icon: "⚠️", title: "Stage 1 — WARNING (10s)", desc: "Minor impact detected. A 10-second countdown modal appears. Driver can cancel with 'I'm Safe' to log a FALSE_ALARM to the database." },
      { icon: "🚨", title: "Stage 2 — SMALL_CRASH (30s)", desc: "No response after 10 seconds. Escalates to Small Crash with a 30-second countdown and a more urgent notification push." },
      { icon: "🆘", title: "Stage 3 — SEVERE_CRASH (60s)", desc: "Final escalation. NexFleet fetches high-accuracy GPS coordinates and dispatches a SEVERE_CRASH alert to the backend with EMERGENCY_DISPATCHED status." },
      { icon: "🗄️", title: "Alert Logging", desc: "Every alert — cancel or escalation — is persisted to the MySQL alerts table with vehicle_id, stage, status, GPS message, and timestamp." },
    ],
    badges: [
      { label: "3-Stage Escalation", color: "orange" },
      { label: "Crash Detection", color: "orange" },
      { label: "MySQL Logging", color: "blue" },
      { label: "REST API", color: "cyan" },
      { label: "Notification System", color: "purple" },
    ],
  },
];

/* ── Crash Flow Diagram Component ───────────────────────────── */
const CrashFlowDiagram = () => {
  const [activeNode, setActiveNode] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev % 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="crash-flow">
      <div className={`crash-node ${activeNode === 1 ? 'active' : ''}`}>WARNING</div>
      <div className={`crash-connector ${activeNode >= 2 ? 'active' : ''}`} />
      <div className={`crash-node ${activeNode === 2 ? 'active' : ''}`}>ALERT</div>
      <div className={`crash-connector ${activeNode === 3 ? 'active' : ''}`} />
      <div className={`crash-node ${activeNode === 3 ? 'active' : ''}`}>SOS DISPATCH</div>
    </div>
  );
};

/* ── Component ──────────────────────────────────────────────── */
export default function Landing() {
  useScrollReveal();
  const navScrolled = useNavScroll();
  const [activeSlide, setActiveSlide] = useState(0);
  const [showMotto, setShowMotto] = useState(false);
  const [showConsoleConcept, setShowConsoleConcept] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const { theme, setTheme } = useApp();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const renderFeatureDiagram = (index, Icon) => {
    switch (index) {
      case 0: // Live GPS Telemetry
        return (
          <svg className="gps-path-svg" viewBox="0 0 300 100">
            <path
              id="motionPath"
              className="gps-path-line"
              d="M10,50 Q75,10 150,50 T290,50"
            />
            <circle r="6" className="gps-pulsing-dot">
              <animateMotion dur="4s" repeatCount="indefinite" path="M10,50 Q75,10 150,50 T290,50" />
            </circle>
          </svg>
        );
      case 1: // Predictive Service Alerts
        return (
          <div className="radar-circle">
            <div className="radar-sweep-line" />
            <div className="radar-target">
              <Icon size={32} />
            </div>
          </div>
        );
      case 2: // 3-Stage Crash Detection
        return <CrashFlowDiagram />;
      case 3: // Fleet Health Analytics
        return (
          <div className="health-dashboard">
            <div className="health-gauge-ring" style={{ borderColor: 'rgba(249, 115, 22, 0.3)' }}>
              <span className="gauge-val">72%</span>
              <span className="gauge-lbl">Fuel</span>
            </div>
            <div className="health-gauge-ring" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <span className="gauge-val" style={{ color: '#10b981' }}>Good</span>
              <span className="gauge-lbl">Tyres</span>
            </div>
            <div className="health-gauge-ring" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
              <span className="gauge-val" style={{ color: '#8b5cf6' }}>98%</span>
              <span className="gauge-lbl">Batt</span>
            </div>
          </div>
        );
      case 4: // Driver-Ready Reports
        return (
          <div className="reports-list">
            <div className="report-item" style={{ animationDelay: '0.1s' }}>
              <span className="report-item-title">Weekly Diagnostics Report</span>
              <span className="report-item-status" />
            </div>
            <div className="report-item" style={{ animationDelay: '0.3s' }}>
              <span className="report-item-title">Driver Safety Scores</span>
              <span className="report-item-status" style={{ backgroundColor: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }} />
            </div>
            <div className="report-item" style={{ animationDelay: '0.5s' }}>
              <span className="report-item-title">Maintenance Log Archive</span>
              <span className="report-item-status" />
            </div>
          </div>
        );
      case 5: // Connected Vehicle Controls
        return (
          <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
            <div className="signal-hub">
              <Icon size={24} />
            </div>
            <div className="signal-wave" style={{ animationDelay: '0s' }} />
            <div className="signal-wave" style={{ animationDelay: '0.6s' }} />
            <div className="signal-wave" style={{ animationDelay: '1.2s' }} />
          </div>
        );
      default:
        return null;
    }
  };

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((s) => (s + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Injects window.scrollY to CSS variable for high-performance parallax scrolling
  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty("--scroll", window.scrollY + "px");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className={`landing-nav${navScrolled ? " scrolled" : ""}`}>
        <div className="nav-inner-landing">
          <a
            href="#"
            className="nav-brand"
            aria-label="NexFleet home"
            onClick={(e) => {
              e.preventDefault();
              setShowMotto(true);
            }}
          >
            <img src="/logo-icon.png" alt="NexFleet Logo" className="nav-logo-img" />
            <div className="nav-brand-text">
              <span className="nav-brand-name">NexFleet</span>
              <span className="nav-brand-sub">Smart Vehicle Monitor</span>
            </div>
          </a>

          <ul className="nav-links">
            {[
              ["#features", "Features"],
              ["#modules", "Modules"],
              ["#workflow", "Workflow"],
              ["#testimonials", "Reviews"],
            ].map(([href, label]) => (
              <li key={label}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>

          <div className="nav-cta">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                width: "40px",
                height: "40px",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: "var(--text)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="btn-nav btn-nav-ghost">
              Sign In
            </Link>
            <Link to="/login" className="btn-nav btn-nav-primary">
              Launch Dashboard →
            </Link>
          </div>

          <button className="nav-hamburger" aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb-wrap hero-orb-wrap-1">
            <div className="hero-orb hero-orb-1" />
          </div>
          <div className="hero-orb-wrap hero-orb-wrap-2">
            <div className="hero-orb hero-orb-2" />
          </div>
          <div className="hero-orb-wrap hero-orb-wrap-3">
            <div className="hero-orb hero-orb-3" />
          </div>
          <div className="hero-wave hero-wave-1" />
          <div className="hero-wave hero-wave-2" />
          <div className="hero-wave hero-wave-3" />
          <div className="hero-grid" />
          <div className="hero-grid-3d" />
          <div className="hero-scanline" />
        </div>

        <div className="hero-inner">
          {/* Left */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Live fleet command center
            </div>

            <h1 className="hero-title">
              Take control of every vehicle in{" "}
              <span className="hero-title-gradient">real time.</span>
            </h1>

            <p className="hero-desc">
              NexFleet unifies live GPS tracking, vehicle health, crash
              detection, driver operations, and maintenance insights inside
              one premium operations console.
            </p>

            <div className="hero-actions">
              <Link to="/login" className="btn-hero-primary">
                <span>Go to Dashboard</span>
                <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn-hero-secondary">
                Explore Features <ChevronRight size={16} />
              </a>
            </div>

            <div className="hero-chips">
              {["Live GPS Telemetry", "Predictive Alerts", "Crash SOS", "Driver Reports"].map(
                (chip) => (
                  <span className="hero-chip" key={chip}>
                    <span className="hero-chip-dot" />
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right — Dashboard Mockup */}
          <div className="hero-visual">
            <div
              className="dashboard-mockup"
              onClick={() => setShowConsoleConcept(true)}
            >
              <div className="mockup-titlebar">
                <div className="mockup-dots">
                  <span className="mockup-dot mockup-dot-red" />
                  <span className="mockup-dot mockup-dot-yellow" />
                  <span className="mockup-dot mockup-dot-green" />
                </div>
                <span className="mockup-label">⚡ SYNCED · 24 VEHICLES</span>
              </div>

              {/* Map preview */}
              <div className="mockup-map">
                <div className="mockup-route" />
                <span className="mockup-route-tag">Route A-18</span>
                <MapPin className="mockup-pin" size={28} />
              </div>

              {/* Metric cards */}
              <div className="mockup-cards">
                <div className="mockup-card">
                  <div className="mockup-card-label">Fleet Readiness</div>
                  <div className="mockup-card-value">96%</div>
                  <div className="mockup-progress">
                    <div className="mockup-progress-fill" style={{ width: "96%" }} />
                  </div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-card-label">Live Activity</div>
                  <div className="mockup-bars">
                    {barHeights.map((h, i) => (
                      <div
                        key={i}
                        className="mockup-bar"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────── */}
      <div className="stats-bar">
        <div className="stats-inner">
          {stats.map(({ value, label }, i) => (
            <div
              className="stat-item reveal"
              style={{ animationDelay: `${i * 0.1}s` }}
              key={label}
            >
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ───────────────────────────────────────────── */}
      <section id="features" className="section features-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge reveal">
              <Activity size={14} /> Core Capabilities
            </div>
            <h2 className="section-title reveal reveal-delay-1">
              Everything a fleet operator{" "}
              <span className="hero-title-gradient">scans first.</span>
            </h2>
            <p className="section-desc reveal reveal-delay-2">
              Shared cards, buttons, telemetry signals, and state colors keep
              every surface predictable — from landing to dashboard.
            </p>
          </div>

          <div className="features-grid">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <article
                className={`feature-card reveal reveal-delay-${(i % 3) + 1}`}
                key={title}
                onClick={() => setSelectedFeature(features[i])}
              >
                <div className="feature-icon" style={{ color }}>
                  <Icon size={24} />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flip Product Modules ───────────────────────────────── */}
      <section id="modules" className="section products-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge reveal">
              <Monitor size={14} /> Dashboard Modules
            </div>
            <h2 className="section-title reveal reveal-delay-1">
              Hover to explore each{" "}
              <span className="hero-title-gradient">module.</span>
            </h2>
            <p className="section-desc reveal reveal-delay-2">
              NexFleet ships with purpose-built pages for every operational
              need — flip any card to see what's inside.
            </p>
          </div>

          <div className="products-grid reveal reveal-delay-2">
            {modules.map(({ label, title, desc, icon: Icon, emoji, color }) => (
              <div className="flip-card" key={title}>
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-front">
                    <div className="flip-front-img" style={{ background: color }}>
                      <span className="flip-front-img-icon">{emoji}</span>
                    </div>
                    <div className="flip-front-info">
                      <div className="flip-front-label">{label}</div>
                      <p className="flip-front-title">{title}</p>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="flip-back">
                    <div className="flip-back-icon">
                      <Icon size={28} />
                    </div>
                    <h3 className="flip-back-title">{title}</h3>
                    <p className="flip-back-desc">{desc}</p>
                    <Link to="/login" className="flip-back-btn">
                      Open Module <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ───────────────────────────────────────────── */}
      <section id="workflow" className="section workflow-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge reveal">
              <Radio size={14} /> How It Works
            </div>
            <h2 className="section-title reveal reveal-delay-1">
              Three steps to{" "}
              <span className="hero-title-gradient">total fleet control.</span>
            </h2>
          </div>

          <div className="workflow-steps">
            {workflowSteps.map(({ num, title, desc }, i) => (
              <article
                className={`workflow-step reveal reveal-delay-${i + 1}`}
                key={title}
                onClick={() => setSelectedWorkflow(workflowSteps[i])}
              >
                <div className="workflow-step-num">{num}</div>
                <h3 className="workflow-step-title">{title}</h3>
                <p className="workflow-step-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section id="testimonials" className="section testimonials-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge reveal">
              <ShieldCheck size={14} /> Trusted by Operators
            </div>
            <h2 className="section-title reveal reveal-delay-1">
              What fleet teams{" "}
              <span className="hero-title-gradient">are saying.</span>
            </h2>
          </div>

          <div className="testimonials-carousel reveal reveal-delay-2">
            {testimonials.map((group, gi) => (
              <div
                key={gi}
                className={`testimonial-slide${activeSlide === gi ? " active" : ""}`}
              >
                {group.map(({ stars, text, name, role, initial }) => (
                  <div className="testimonial-card" key={name}>
                    <div className="testimonial-stars">
                      {Array.from({ length: stars }).map((_, i) => (
                        <span className="star" key={i}>★</span>
                      ))}
                    </div>
                    <p className="testimonial-text">{text}</p>
                    <div className="testimonial-author">
                      <div className="author-avatar">{initial}</div>
                      <div>
                        <p className="author-name">{name}</p>
                        <p className="author-role">{role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="testimonials-nav">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonials-dot${activeSlide === i ? " active" : ""}`}
                onClick={() => setActiveSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges Marquee ───────────────────────────────── */}
      <div className="trust-section reveal">
        <div className="trust-marquee-wrap">
          <div className="trust-marquee">
            {trustBadges.map(({ icon, label }, i) => (
              <span className="trust-badge" key={i}>
                <span className="trust-badge-icon">{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Section ────────────────────────────────────────── */}
      <section className="section cta-section">
        <div className="cta-bg">
          <div className="cta-orb" />
        </div>
        <div className="cta-inner reveal">
          <Activity
            size={40}
            style={{ color: "#60a5fa", margin: "0 auto 1.5rem", display: "block" }}
          />
          <h2 className="cta-title">
            Ready for the{" "}
            <span className="hero-title-gradient">control panel?</span>
          </h2>
          <p className="cta-desc">
            The same palette, type scale, controls, and containers continue
            through login and dashboard. Sign in with Google and you're live
            in under 30 seconds.
          </p>
          <div className="cta-actions">
            <Link to="/login" className="btn-hero-primary">
              <span>Launch Console</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-hero-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand col */}
            <div className="footer-brand-col">
              <a
                href="#"
                className="footer-brand"
                onClick={(e) => {
                  e.preventDefault();
                  setShowMotto(true);
                }}
              >
                <img src="/logo-icon.png" alt="NexFleet Logo" className="nav-logo-img" />
                <span className="footer-brand-name">NexFleet</span>
              </a>
              <p className="footer-brand-desc">
                A premium in-vehicle infotainment and monitoring system.
                Built with React, Spring Boot, and Firebase for real-time
                fleet intelligence.
              </p>
              <div className="footer-social">
                {[
                  { icon: <Github size={16} />, href: "#" },
                  { icon: <Twitter size={16} />, href: "#" },
                  { icon: <Linkedin size={16} />, href: "#" },
                  { icon: <Globe size={16} />, href: "#" },
                ].map(({ icon, href }, i) => (
                  <a key={i} href={href} className="social-btn" aria-label="Social link">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="footer-col-title">Product</p>
              <ul className="footer-links">
                {["Dashboard", "GPS Tracking", "Crash Alerts", "Media Player", "Connectivity"].map(
                  (l) => <li key={l}><a href="#features">{l}</a></li>
                )}
              </ul>
            </div>

            <div>
              <p className="footer-col-title">Technology</p>
              <ul className="footer-links">
                {["React + Vite", "Spring Boot", "MySQL", "Firebase Auth", "OpenStreetMap"].map(
                  (l) => <li key={l}><a href="#features">{l}</a></li>
                )}
              </ul>
            </div>

            <div>
              <p className="footer-col-title">Company</p>
              <ul className="footer-links">
                {["About", "Features", "Workflow", "Reviews", "Login"].map((l) => (
                  <li key={l}>
                    <a href={l === "Login" ? "/login" : "#features"}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">
              © 2026 <span>NexFleet</span> · Smart Vehicle Monitor · MIT License
            </p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Docs</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Motto Modal ── */}
      {showMotto && (
        <div className="motto-modal-overlay" onClick={() => setShowMotto(false)}>
          <div className="motto-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="motto-close-btn" onClick={() => setShowMotto(false)} aria-label="Close modal">
              &times;
            </button>
            <div className="motto-icon-container">
              <img src="/logo-icon.png" alt="NexFleet Logo" className="motto-logo-img" />
            </div>
            <h3 className="motto-title">NexFleet Mission</h3>
            <blockquote className="motto-quote">
              "Seamless Connectivity. Real-Time Security. Complete Control."
            </blockquote>
            <p className="motto-desc">
              Empowering drivers and fleet operators with intelligent telemetry, 
              advanced crash notifications, and a premium cabin experience. 
              We bridge the gap between in-vehicle technology and fleet intelligence.
            </p>
            <div className="motto-footer-bar">
              <span className="motto-pill">INFOTAINMENT</span>
              <span className="motto-pill">TELEMETRY</span>
              <span className="motto-pill">SAFETY</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Concept Modal ── */}
      {showConsoleConcept && (
        <div className="motto-modal-overlay" onClick={() => setShowConsoleConcept(false)}>
          <div className="concept-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="motto-close-btn" onClick={() => setShowConsoleConcept(false)} aria-label="Close modal">
              &times;
            </button>
            <div className="concept-header">
              <span className="concept-subtitle">Interactive Preview</span>
              <h3 className="concept-title">NexFleet Control Console</h3>
            </div>
            
            <div className="concept-body">
              <div className="concept-section">
                <div className="concept-section-icon">
                  <MapPin size={20} />
                </div>
                <div className="concept-section-content">
                  <span className="concept-section-title">Real-Time Routing & Telemetry</span>
                  <p className="concept-section-desc">
                    Plots current travel routes (e.g. <strong>Route A-18</strong>) with dynamic GPS pins. 
                    Calculates exact geographic coordinates and streams data back to dispatcher dashboards.
                  </p>
                </div>
              </div>

              <div className="concept-section">
                <div className="concept-section-icon">
                  <Car size={20} />
                </div>
                <div className="concept-section-content">
                  <span className="concept-section-title">Fleet Readiness Scoring</span>
                  <p className="concept-section-desc">
                    Aggregates diagnostics metrics (tyre pressure, fuel levels, engine status) 
                    into a single readiness index to ensure peak dispatch safety.
                  </p>
                </div>
              </div>

              <div className="concept-section">
                <div className="concept-section-icon">
                  <Activity size={20} />
                </div>
                <div className="concept-section-content">
                  <span className="concept-section-title">Live Diagnostic Streams</span>
                  <p className="concept-section-desc">
                    Visualizes incoming cellular and satellite telemetry packets, highlighting network latency, 
                    bandwidth sync, and audio stream stability.
                  </p>
                </div>
              </div>
            </div>

            <div className="motto-footer-bar">
              <span className="motto-pill">REALTIME SYNC</span>
              <span className="motto-pill">PREDICTIVE DIAGNOSTICS</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Workflow Detail Modal ── */}
      {selectedWorkflow && (
        <div className="motto-modal-overlay" onClick={() => setSelectedWorkflow(null)}>
          <div className="workflow-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="motto-close-btn"
              onClick={() => setSelectedWorkflow(null)}
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Header */}
            <div className="wf-modal-header">
              <div className="wf-modal-num">{selectedWorkflow.num}</div>
              <div className="wf-modal-header-text">
                <span className="wf-modal-label">Step {selectedWorkflow.num} of 03 · NexFleet Workflow</span>
                <h3 className="wf-modal-title">{selectedWorkflow.title}</h3>
              </div>
            </div>

            {/* Summary */}
            <p className="wf-modal-desc">{selectedWorkflow.detail}</p>

            {/* Timeline */}
            <div className="wf-timeline">
              {selectedWorkflow.steps.map(({ icon, title, desc }) => (
                <div className="wf-timeline-item" key={title}>
                  <div className="wf-timeline-dot">
                    <span style={{ fontSize: "1rem" }}>{icon}</span>
                  </div>
                  <div className="wf-timeline-content">
                    <p className="wf-timeline-title">{title}</p>
                    <p className="wf-timeline-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech badges */}
            <div className="wf-tech-section">
              <p className="wf-tech-label">Technologies Involved</p>
              <div className="wf-tech-badges">
                {selectedWorkflow.badges.map(({ label, color }) => (
                  <span key={label} className={`wf-badge wf-badge-${color}`}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Feature Detail Modal ── */}
      {selectedFeature && (
        <div className="motto-modal-overlay" onClick={() => setSelectedFeature(null)}>
          <div className="feature-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="motto-close-btn"
              onClick={() => setSelectedFeature(null)}
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Header */}
            <div className="feature-modal-header">
              <div className="feature-modal-icon-badge" style={{ color: selectedFeature.color }}>
                {React.createElement(selectedFeature.icon, { size: 28 })}
              </div>
              <h3 className="feature-modal-title">{selectedFeature.title}</h3>
            </div>

            {/* Diagram Stage */}
            <div className="diagram-stage">
              {renderFeatureDiagram(selectedFeature.index, selectedFeature.icon)}
            </div>

            {/* Summary */}
            <p className="feature-modal-desc">{selectedFeature.desc}</p>

            <div className="motto-footer-bar">
              <span className="motto-pill" style={{ color: selectedFeature.color, borderColor: selectedFeature.color + '40', background: selectedFeature.color + '10' }}>
                VISUALISATION MODULE
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

