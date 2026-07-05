import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { motion } from 'framer-motion';
import { Car, Thermometer, Wind, Fuel, Wrench, CircleGauge, Disc, Radio } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Vehicle() {
  const { stats, vehicleId, liveMode, wifiConnected } = useApp();
  const serviceKmLeft = Math.max(0, stats.serviceDueKm - stats.mileageKm);

  return (
    <motion.div 
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="panel" variants={itemVariants} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <h2><Radio size={24} color="var(--success)" /> Active Connection</h2>
        <div style={{display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 200, background: 'var(--panel-light)', padding: 16, borderRadius: 12, border: '1px solid var(--panel-border)'}}>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'rgba(29, 185, 84, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <Car size={24} color="var(--success)" />
              </div>
              <div>
                 <div style={{color: 'var(--muted)', fontSize: 13}}>Directly Connected To</div>
                 <div style={{fontWeight: 600, fontSize: 18}}>Vehicle #{vehicleId} (CyberCab)</div>
              </div>
           </div>

           <div style={{display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 200, background: 'var(--panel-light)', padding: 16, borderRadius: 12, border: '1px solid var(--panel-border)'}}>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: liveMode ? 'rgba(29, 185, 84, 0.2)' : 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <CircleGauge size={24} color={liveMode ? 'var(--success)' : 'var(--danger)'} />
              </div>
              <div>
                 <div style={{color: 'var(--muted)', fontSize: 13}}>Telemetry Link</div>
                 <div style={{fontWeight: 600, fontSize: 16, color: liveMode ? 'var(--success)' : 'var(--danger)'}}>{liveMode ? 'Actively Streaming' : 'Disconnected'}</div>
              </div>
           </div>

           <div style={{display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 200, background: 'var(--panel-light)', padding: 16, borderRadius: 12, border: '1px solid var(--panel-border)'}}>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <Wind size={24} color="#3b82f6" />
              </div>
              <div>
                 <div style={{color: 'var(--muted)', fontSize: 13}}>Network Protocol</div>
                 <div style={{fontWeight: 600, fontSize: 16}}>{wifiConnected ? 'WiFi + Cellular' : 'Cellular Only'}</div>
              </div>
           </div>
        </div>
      </motion.section>

      <motion.section className="panel" variants={itemVariants}>
        <h2><Disc size={24} color="var(--accent)" /> Tyre Pressure</h2>
        <div className="card-grid">
          <div className="card">
            <div className="card-header"><span className="card-title">Front Left</span></div>
            <div className="card-value">{stats.tyrePressureFL.toFixed(1)} <span>PSI</span></div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Front Right</span></div>
            <div className="card-value">{stats.tyrePressureFR.toFixed(1)} <span>PSI</span></div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Rear Left</span></div>
            <div className="card-value">{stats.tyrePressureRL.toFixed(1)} <span>PSI</span></div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Rear Right</span></div>
            <div className="card-value">{stats.tyrePressureRR.toFixed(1)} <span>PSI</span></div>
          </div>
        </div>
      </motion.section>

      <motion.section className="panel" variants={itemVariants}>
        <h2><Fuel size={24} color="var(--accent)" /> Fuel & Mileage</h2>
        <div className="card-grid">
          <div className="card">
            <div className="card-header"><span className="card-title">Remaining Fuel</span><Fuel size={20} color="var(--success)"/></div>
            <div className="card-value">{stats.fuelLevel.toFixed(0)} <span>%</span></div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Total Odometer</span><CircleGauge size={20} color="var(--accent)"/></div>
            <div className="card-value">{stats.mileageKm.toFixed(0)} <span>km</span></div>
          </div>
        </div>
      </motion.section>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        <motion.section className="panel" variants={itemVariants}>
          <h2><Wrench size={24} color="var(--warning)" /> Service Reminder</h2>
          <div className="location-card" style={{gridTemplateColumns: '1fr 1fr'}}>
            <div className="loc-item">
              <span className="loc-label">Next Service Date</span>
              <span className="loc-val">{stats.serviceDueDate}</span>
            </div>
            <div className="loc-item">
              <span className="loc-label">Distance Remaining</span>
              <span className="loc-val" style={{color: serviceKmLeft < 1000 ? 'var(--warning)' : 'var(--text)'}}>{serviceKmLeft.toFixed(0)} <span style={{fontSize: 14, color: 'var(--muted)'}}>km</span></span>
            </div>
          </div>
        </motion.section>

        <motion.section className="panel" variants={itemVariants}>
          <h2><Thermometer size={24} color="var(--accent-2)" /> Comfort Analyzer</h2>
          <div className="location-card" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
            <div className="loc-item">
              <span className="loc-label">Cabin Temp</span>
              <span className="loc-val">{stats.cabinTemperature.toFixed(1)}°</span>
            </div>
            <div className="loc-item">
              <span className="loc-label">Seat Condition</span>
              <span className="loc-val" style={{fontSize: 18, marginTop: 4}}>{stats.seatCondition}</span>
            </div>
            <div className="loc-item">
              <span className="loc-label">Cleanliness</span>
              <span className="loc-val" style={{fontSize: 18, marginTop: 4}}>{stats.cleanliness}</span>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
