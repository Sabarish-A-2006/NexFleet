import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext.jsx';
import { motion } from 'framer-motion';
import { Compass, Navigation, Map as MapIcon, Crosshair } from 'lucide-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

function MapUpdater({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

export default function Gps() {
  const { location } = useApp();

  return (
    <motion.div 
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="panel" variants={itemVariants} style={{padding: 0, overflow: 'hidden'}}>
        <div style={{padding: '24px 28px', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: 10}}>
            <MapIcon size={24} color="var(--accent)" /> Global Positioning
          </h2>
          <div className="status-pill ok" style={{background: 'var(--success-bg)', color: 'var(--success)'}}><Compass size={16} /> GPS Locked – High Accuracy</div>
        </div>
        
        {/* We use a dark variant map URL for OpenStreetMap to match our dark theme */}
        <MapContainer center={[location.lat, location.lng]} zoom={15} className="map" style={{height: 500, borderRadius: 0, border: 'none'}}>
          <MapUpdater lat={location.lat} lng={location.lng} />
          <TileLayer
             attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
             url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[location.lat, location.lng]}>
             <Popup>Vehicle Last Known Location</Popup>
          </Marker>
          <Circle center={[location.lat, location.lng]} radius={200} pathOptions={{color: 'var(--accent)', fillColor: 'var(--accent)', fillOpacity: 0.1}} />
        </MapContainer>
      </motion.section>

      <motion.section className="panel" variants={itemVariants}>
        <h2><Navigation size={24} color="var(--success)" /> Telemetry Data</h2>
        <div className="location-card" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
          <div className="loc-item">
            <span className="loc-label">Latitude</span>
            <span className="loc-val">{location.lat.toFixed(5)}</span>
          </div>
          <div className="loc-item">
            <span className="loc-label">Longitude</span>
            <span className="loc-val">{location.lng.toFixed(5)}</span>
          </div>
          <div className="loc-item">
            <span className="loc-label">Altitude</span>
            <span className="loc-val">920 <span style={{fontSize: 14, color: 'var(--muted)'}}>m</span></span>
          </div>
          <div className="loc-item">
            <span className="loc-label"><Crosshair size={14} style={{display: 'inline', verticalAlign: 'middle', marginRight: 4}} /> Speed Vector</span>
            <span className="loc-val" style={{color: 'var(--accent)'}}>{location.speed.toFixed(1)} <span style={{fontSize: 14, color: 'var(--muted)'}}>km/h</span></span>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
