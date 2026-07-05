import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Smartphone, Navigation, Car, AlertTriangle, MonitorPlay, Zap, Activity } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/logo-icon.png" alt="NexFleet Logo" className="brand-logo-sidebar-img" />
        <div>
          <div className="brand-title">NexFleet VMS</div>
          <div className="brand-sub">Premium Console</div>
        </div>
      </div>
      <nav className="nav">
        <NavLink to="/dashboard"><LayoutDashboard size={18} /> Dashboard</NavLink>
        <NavLink to="/media"><MonitorPlay size={18} /> Media & Audio</NavLink>
        <NavLink to="/apps"><Smartphone size={18} /> Integrated Apps</NavLink>
        <NavLink to="/connectivity"><Radio size={18} /> Connectivity</NavLink>
        <NavLink to="/gps"><Navigation size={18} /> GPS & Map</NavLink>
        <NavLink to="/vehicle"><Car size={18} /> Vehicle Status</NavLink>
        <NavLink to="/crash-meter"><Activity size={18} /> Crash Meter</NavLink>
        <NavLink to="/alerts"><AlertTriangle size={18} /> Alerts & Logs</NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="status-pill">
          <div className="size-2 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
          System Online
        </div>
      </div>
    </aside>
  );
}
