import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useApp } from '../context/AppContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { motion } from 'framer-motion';
import { ShieldAlert, History, AlertTriangle, RefreshCw } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Alerts() {
  const { crashStage, crashCountdown, crashActive, triggerImpact, liveMode } = useApp();
  const { pushNotification } = useNotifications();
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = () => {
    // Handling both the nested data from the original backend and our mock
    api.get('/alerts')
      .then((res) => {
        const payload = res.data?.data || res.data || [];
        setAlerts(Array.isArray(payload) ? payload : []);
      })
      .catch(() => setAlerts([]));
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(loadAlerts, 15000);
    return () => clearInterval(interval);
  }, [liveMode]);

  const runSystemDiagnostics = async () => {
    pushNotification('Running Anti-Collision Sensor Diagnostics...', 'info');
    setTimeout(async () => {
      try {
        await api.post('/alerts', {
          vehicleId: 1,
          stage: 'DIAGNOSTIC_CHECK',
          status: 'CLEARED',
          message: 'All 360° LIDAR & Anti-Collision sensors are fully operational.'
        });
        loadAlerts();
        pushNotification('Diagnostics complete. Prevention system active.', 'success');
      } catch (e) {
        // ignore
      }
    }, 1200);
  };

  return (
    <motion.div 
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="panel" variants={itemVariants}>
        <h2><ShieldAlert size={24} color="var(--danger)" /> Crash Prevention System</h2>
        <div className="location-card" style={{gridTemplateColumns: 'repeat(4, 1fr)', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)'}}>
          <div className="loc-item">
            <span className="loc-label">System Active</span>
            <span className="loc-val" style={{color: crashActive ? 'var(--danger)' : 'var(--success)'}}>{crashActive ? 'YES' : 'STANDBY'}</span>
          </div>
          <div className="loc-item">
            <span className="loc-label">Sensor Health</span>
            <span className="loc-val" style={{color: 'var(--success)'}}>100% ONLINE</span>
          </div>
          <div className="loc-item">
            <span className="loc-label">Current Stage</span>
            <span className="loc-val">{crashStage || 'Monitoring'}</span>
          </div>
          <div className="loc-item">
            <span className="loc-label">Countdown</span>
            <span className="loc-val">{crashCountdown ?? '--'}s</span>
          </div>
        </div>
        <div className="actions" style={{marginTop: 24}}>
          <button className="danger" onClick={triggerImpact} style={{gap: 8}}>
            <AlertTriangle size={18} /> Simulate Crash
          </button>
          <button className="secondary" onClick={runSystemDiagnostics} style={{gap: 8}}>
            <RefreshCw size={18} /> Run Diagnostics
          </button>
        </div>
      </motion.section>

      <motion.section className="panel" variants={itemVariants}>
        <h2><History size={24} color="var(--accent)" /> Incident History</h2>
        <div className="table" style={{marginTop: 16}}>
          <div className="table-row header">
            <div>ID</div>
            <div>Alert Type / Stage</div>
            <div>Severity / Status</div>
            <div>Time / Message</div>
          </div>
          {alerts.length === 0 ? (
            <div style={{color: 'var(--muted)', padding: '24px 0', textAlign: 'center'}}>No incidents recorded. Drive safe!</div>
          ) : (
            alerts.map((alert) => (
              <motion.div 
                className="table-row" 
                key={alert.id}
                whileHover={{x: 4, backgroundColor: 'var(--panel)'}}
              >
                <div style={{color: 'var(--muted)'}}>#{alert.id}</div>
                <div>{alert.stage || alert.type}</div>
                <div>
                  <span className={`status-pill ${alert.severity === 'High' ? 'danger' : 'warn'}`} style={{background: 'transparent', border: '1px solid currentColor'}}>
                    {alert.status || alert.severity}
                  </span>
                </div>
                <div style={{fontSize: 13, color: 'var(--muted)', display: 'flex', flexDirection: 'column'}}>
                  <span>{alert.message}</span>
                  <span style={{fontSize: 11, opacity: 0.6, marginTop: 4}}>{new Date(alert.createdAt || alert.timestamp || Date.now()).toLocaleString()}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
