import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { motion } from 'framer-motion';
import { Wifi, Bluetooth, MapPin, Radio, Activity, Link as LinkIcon, Lock } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Connectivity() {
  const [scanSeed, setScanSeed] = useState(0);
  const {
    wifiConnected,
    bluetoothConnected,
    gpsEnabled,
    liveMode,
    setWifiConnected,
    setBluetoothConnected,
    setGpsEnabled
  } = useApp();

  const networks = useMemo(() => {
    const pools = ['Vehicle-Net', 'Garage-5G', 'CityMesh', 'HighwayHub', 'CafeLink'];
    return pools.map((name) => ({
      name,
      strength: Math.floor(40 + Math.random() * 60),
      secure: Math.random() > 0.3
    }));
  }, [scanSeed]);

  return (
    <motion.div 
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="panel" variants={itemVariants}>
        <h2><Radio size={24} color="var(--accent)" /> Connectivity Control</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20}}>
          {/* Wi-Fi Control */}
          <div className="card" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{padding: 12, borderRadius: 12, background: wifiConnected ? 'var(--success-bg)' : 'var(--danger-bg)', color: wifiConnected ? 'var(--success)' : 'var(--danger)'}}>
                <Wifi size={24} />
              </div>
              <div>
                <div style={{fontWeight: 600, fontSize: 16}}>Wi-Fi Network</div>
                <div style={{fontSize: 13, color: 'var(--muted)', marginTop: 4}}>{wifiConnected ? 'Connected to Vehicle-Net' : 'Disconnected'}</div>
              </div>
            </div>
            <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <input type="checkbox" checked={wifiConnected} onChange={(e) => setWifiConnected(e.target.checked)} style={{width: 20, height: 20, accentColor: 'var(--accent)'}} />
            </label>
          </div>

          {/* Bluetooth Control */}
          <div className="card" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{padding: 12, borderRadius: 12, background: bluetoothConnected ? 'var(--accent-glow)' : 'var(--danger-bg)', color: bluetoothConnected ? 'var(--accent)' : 'var(--danger)'}}>
                <Bluetooth size={24} />
              </div>
              <div>
                <div style={{fontWeight: 600, fontSize: 16}}>Bluetooth Pairing</div>
                <div style={{fontSize: 13, color: 'var(--muted)', marginTop: 4}}>{bluetoothConnected ? "Driver's Phone Connected" : 'Pairing Mode Off'}</div>
              </div>
            </div>
            <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <input type="checkbox" checked={bluetoothConnected} onChange={(e) => setBluetoothConnected(e.target.checked)} style={{width: 20, height: 20, accentColor: 'var(--accent)'}} />
            </label>
          </div>

          {/* GPS Control */}
          <div className="card" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{padding: 12, borderRadius: 12, background: gpsEnabled ? 'var(--success-bg)' : 'var(--danger-bg)', color: gpsEnabled ? 'var(--success)' : 'var(--danger)'}}>
                <MapPin size={24} />
              </div>
              <div>
                <div style={{fontWeight: 600, fontSize: 16}}>Location Services (GPS)</div>
                <div style={{fontSize: 13, color: 'var(--muted)', marginTop: 4}}>{gpsEnabled ? 'High Accuracy Active' : 'Location Tracking Disabled'}</div>
              </div>
            </div>
            <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <input type="checkbox" checked={gpsEnabled} onChange={(e) => setGpsEnabled(e.target.checked)} style={{width: 20, height: 20, accentColor: 'var(--accent)'}} />
            </label>
          </div>

        </div>
        <div className="actions" style={{marginTop: 20}}>
          <button className="secondary" onClick={() => setScanSeed((s) => s + 1)}>
            <LinkIcon size={16} /> Scan Networks
          </button>
        </div>
      </motion.section>

      <motion.section className="panel" variants={itemVariants}>
        <h2><LinkIcon size={24} color="var(--success)" /> Active Connected Environment</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20}}>
          {bluetoothConnected && (
            <div className="card" style={{display: 'flex', gap: 16, alignItems: 'center', background: 'var(--panel-light)', border: '1px solid var(--accent-glow)'}}>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Bluetooth size={24} color="var(--accent)"/>
              </div>
              <div>
                <div style={{fontWeight: 600, fontSize: 16}}>Driver's iPhone 15 Pro</div>
                <div style={{color: 'var(--muted)', fontSize: 13}}>Media & Hands-Free Active</div>
              </div>
            </div>
          )}
          {wifiConnected && (
            <div className="card" style={{display: 'flex', gap: 16, alignItems: 'center', background: 'var(--panel-light)', border: '1px solid rgba(59, 130, 246, 0.4)'}}>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Wifi size={24} color="#3b82f6"/>
              </div>
              <div>
                <div style={{fontWeight: 600, fontSize: 16}}>Smart Home Hub Target</div>
                <div style={{color: 'var(--muted)', fontSize: 13}}>IoT Sync Maintained</div>
              </div>
            </div>
          )}
          {liveMode && (
            <div className="card" style={{display: 'flex', gap: 16, alignItems: 'center', background: 'var(--panel-light)', border: '1px solid var(--success-bg)'}}>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Activity size={24} color="var(--success)"/>
              </div>
              <div>
                <div style={{fontWeight: 600, fontSize: 16}}>Cloud Telemetry Edge</div>
                <div style={{color: 'var(--muted)', fontSize: 13}}>Real-Time Processing Valid</div>
              </div>
            </div>
          )}
          {gpsEnabled && (
            <div className="card" style={{display: 'flex', gap: 16, alignItems: 'center', background: 'var(--panel-light)', border: '1px solid rgba(245, 158, 11, 0.4)'}}>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <MapPin size={24} color="#f59e0b"/>
              </div>
              <div>
                <div style={{fontWeight: 600, fontSize: 16}}>V2X Grid Infrastructure</div>
                <div style={{color: 'var(--muted)', fontSize: 13}}>Traffic & Traffic Light Tracking</div>
              </div>
            </div>
          )}
          {!bluetoothConnected && !wifiConnected && !liveMode && !gpsEnabled && (
             <div style={{padding: 24, textAlign: 'center', color: 'var(--muted)', gridColumn: '1 / -1'}}>
               No active connections found. Enable connectivity settings to integrate with devices.
             </div>
          )}
        </div>
      </motion.section>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        <motion.section className="panel" variants={itemVariants}>
          <h2><Activity size={24} color="var(--success)" /> System Status Overview</h2>
          <div className="status-grid" style={{gap: 16}}>
            <div className={`status-pill ${wifiConnected ? '' : 'warn'}`} style={{fontSize: 14, padding: '12px 20px'}}>
              <Wifi size={16} /> <span>Wi-Fi Status: {wifiConnected ? 'Optimal' : 'Offline'}</span>
            </div>
            <div className={`status-pill ${bluetoothConnected ? '' : 'warn'}`} style={{fontSize: 14, padding: '12px 20px', color: bluetoothConnected ? 'var(--accent)' : '', background: bluetoothConnected ? 'var(--accent-glow)' : ''}}>
              <Bluetooth size={16} /> <span>BT Link: {bluetoothConnected ? 'Stable' : 'Lost'}</span>
            </div>
            <div className={`status-pill ${gpsEnabled ? '' : 'warn'}`} style={{fontSize: 14, padding: '12px 20px'}}>
              <MapPin size={16} /> <span>GPS Triangulation: {gpsEnabled ? 'Locked' : 'Disabled'}</span>
            </div>
          </div>
        </motion.section>

        <motion.section className="panel" variants={itemVariants}>
          <h2><Lock size={24} color="var(--muted)" /> Network Security</h2>
          <div className="location-card" style={{alignItems: 'center', gridTemplateColumns: '1fr 1fr'}}>
            <div className="loc-item">
              <span className="loc-label">Firewall</span>
              <span className="loc-val" style={{color: 'var(--success)', fontSize: 18}}>Active Protection</span>
            </div>
            <div className="loc-item">
              <span className="loc-label">Encryption</span>
              <span className="loc-val" style={{fontSize: 18}}>AES-256</span>
            </div>
          </div>
        </motion.section>
      </div>

      <motion.section className="panel" variants={itemVariants}>
        <h2><Wifi size={24} color="var(--accent)" /> Available Networks</h2>
        <div className="table">
          <div className="table-row header">
            <div>SSID</div>
            <div>Signal</div>
            <div>Security</div>
            <div>Status</div>
          </div>
          {networks.map((network) => (
            <div className="table-row" key={network.name}>
              <div>{network.name}</div>
              <div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${network.strength}%` }} />
                </div>
              </div>
              <div>{network.secure ? 'WPA2' : 'Open'}</div>
              <div>{network.name === 'Vehicle-Net' && wifiConnected ? 'Connected' : 'Available'}</div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
