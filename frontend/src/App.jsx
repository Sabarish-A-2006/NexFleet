import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import NotificationCenter from './components/NotificationCenter.jsx';
import CrashAlertModal from './components/CrashAlertModal.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Media from './pages/Media.jsx';
import Apps from './pages/Apps.jsx';
import Connectivity from './pages/Connectivity.jsx';
import Gps from './pages/Gps.jsx';
import Vehicle from './pages/Vehicle.jsx';
import CrashMeter from './pages/CrashMeter.jsx';
import Alerts from './pages/Alerts.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* App Shell Layout Route */}
      <Route
        element={
          <div className="app-shell">
            <Sidebar />
            <div className="app-main">
              <TopBar />
              <div className="app-content">
                <Outlet />
              </div>
            </div>
            <NotificationCenter />
            <CrashAlertModal />
          </div>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="media" element={<Media />} />
        <Route path="apps" element={<Apps />} />
        <Route path="connectivity" element={<Connectivity />} />
        <Route path="gps" element={<Gps />} />
        <Route path="vehicle" element={<Vehicle />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="crash-meter" element={<CrashMeter />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
