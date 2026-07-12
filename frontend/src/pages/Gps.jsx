import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Navigation, Map as MapIcon, Crosshair, MapPin,
  Shield, User, UserCheck, AlertOctagon, Settings, Layers,
  Activity, Sliders, Milestone
} from 'lucide-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ─── Leaflet Marker Fix ───────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// Create custom colored vehicle marker icon
const vehicleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom geofence boundary marker icon
const geofenceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

// ─── Leaflet View Controller ──────────────────────────────────────────────────
function MapController({ center, zoom, followVehicle }) {
  const map = useMap();
  useEffect(() => {
    if (center && followVehicle) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, followVehicle, map]);
  return null;
}

// ─── Map Styles ────────────────────────────────────────────────────────────────
const MAP_STYLES = {
  google_hybrid: {
    name: 'Google Satellite/Hybrid',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  },
  google_road: {
    name: 'Google Roadmap',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  },
  dark_smooth: {
    name: 'Smooth Dark (Stadia)',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    attribution: '&copy; Stadia Maps'
  }
};

export default function Gps() {
  const { location, currentUser, deviceLocationActive, setDeviceLocationActive } = useApp();

  // State configurations
  const [mapStyle, setMapStyle] = useState('google_hybrid');
  const [followVehicle, setFollowVehicle] = useState(true);
  const [geofenceRadius, setGeofenceRadius] = useState(300); // meters
  const [geofenceCenter, setGeofenceCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [trail, setTrail] = useState([]);
  const [showGeofenceConfig, setShowGeofenceConfig] = useState(false);

  // Set initial geofence anchor to matching GPS position once it loads
  useEffect(() => {
    if (location?.lat && location?.lng) {
      setGeofenceCenter({ lat: location.lat, lng: location.lng });
    }
  }, []);

  // Generate dynamic path breadcrumbs
  useEffect(() => {
    if (location?.lat && location?.lng) {
      setTrail(prev => {
        // Prevent stacking duplicates
        if (prev.length > 0) {
          const last = prev[prev.length - 1];
          if (last[0] === location.lat && last[1] === location.lng) return prev;
        }
        return [...prev.slice(-99), [location.lat, location.lng]];
      });
    }
  }, [location]);

  // Geofence Breach logic
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in meters
  };

  const distanceToCenter = location ? getDistance(location.lat, location.lng, geofenceCenter.lat, geofenceCenter.lng) : 0;
  const isBreached = distanceToCenter > geofenceRadius;

  // Simple reverse-geocode approximation (Bangalore region or current device region)
  const getAddress = (lat, lng) => {
    if (!lat || !lng) return 'Acquiring Address...';
    if (deviceLocationActive) {
      return `Position tracked at Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
    }
    if (lat > 12.96 && lat < 12.98 && lng > 77.58 && lng < 77.60) {
      return 'Cubbon Park Road, Mahatma Gandhi Rd, Bengaluru, KA';
    }
    if (lat > 12.92 && lat < 12.95) {
      return 'HSR Layout Sector 3, Outer Ring Road, Bengaluru, KA';
    }
    return 'Halasuru Bypass Road, Indiranagar, Bengaluru, Karnataka 560008';
  };

  const currentStyle = MAP_STYLES[mapStyle];

  return (
    <motion.div
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ gap: 20 }}
    >
      {/* ─── Row 1: Map + Controls Panel ─────────────────────────────────── */}
      <motion.section className="panel" variants={itemVariants} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Panel Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapIcon size={22} color="var(--accent)" />
            <div style={{ lineHeight: 1.2 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Global Tracking System</h2>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Precision GIS overlay engine</span>
            </div>
          </div>

          {/* Map Configurations */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            
            {/* Device Geolocation Toggle */}
            <button
              onClick={() => setDeviceLocationActive(active => !active)}
              style={{
                background: deviceLocationActive ? 'rgba(16,185,129,0.12)' : 'var(--panel-light)',
                border: `1px solid ${deviceLocationActive ? 'rgba(16,185,129,0.4)' : 'var(--panel-border)'}`,
                borderRadius: 10,
                padding: '8px 12px',
                color: deviceLocationActive ? '#10b981' : 'var(--text)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Compass size={13} style={{ animation: deviceLocationActive ? 'spin 6s linear infinite' : 'none' }} />
              {deviceLocationActive ? 'Track Device GPS' : 'Simulation Mode'}
            </button>

            {/* Map Styles Selector */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--panel-border)', borderRadius: 10, padding: 2 }}>
              {Object.entries(MAP_STYLES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setMapStyle(key)}
                  style={{
                    background: mapStyle === key ? 'var(--accent)' : 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    color: mapStyle === key ? '#fff' : 'var(--muted)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {key === 'google_hybrid' ? 'Satellite' : key === 'google_road' ? 'Roadmap' : 'Dark'}
                </button>
              ))}
            </div>

            {/* Follow Toggle */}
            <button
              onClick={() => setFollowVehicle(f => !f)}
              style={{
                background: followVehicle ? 'rgba(59,130,246,0.12)' : 'var(--panel-light)',
                border: `1px solid ${followVehicle ? 'rgba(59,130,246,0.4)' : 'var(--panel-border)'}`,
                borderRadius: 10,
                padding: '8px 12px',
                color: followVehicle ? '#3b82f6' : 'var(--text)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Crosshair size={13} style={{ transform: followVehicle ? 'rotate(45deg)' : 'none', transition: 'all 0.2s' }} />
              {followVehicle ? 'Lock Center' : 'Free Map'}
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div style={{ position: 'relative', width: '100%', height: 480 }}>
          {location ? (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              className="map"
              style={{ height: '100%', width: '100%', zIndex: 1 }}
              zoomControl={true}
            >
              <MapController center={[location.lat, location.lng]} followVehicle={followVehicle} />
              
              {/* Active Map Style Tile */}
              <TileLayer
                attribution={currentStyle.attribution}
                url={currentStyle.url}
                subdomains={currentStyle.subdomains || []}
              />

              {/* Breadcrumb Trail */}
              {trail.length > 1 && (
                <Polyline positions={trail} pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8, dashArray: '4, 8' }} />
              )}

              {/* Geofence Ring */}
              <Circle
                center={[geofenceCenter.lat, geofenceCenter.lng]}
                radius={geofenceRadius}
                pathOptions={{
                  color: isBreached ? '#ef4444' : '#10b981',
                  fillColor: isBreached ? '#ef4444' : '#10b981',
                  fillOpacity: 0.08,
                  weight: 2
                }}
              />

              {/* Geofence Center Pin */}
              <Marker position={[geofenceCenter.lat, geofenceCenter.lng]} icon={geofenceIcon}>
                <Popup>Geofence Anchor Center</Popup>
              </Marker>

              {/* Current Active Vehicle Marker */}
              <Marker position={[location.lat, location.lng]} icon={vehicleIcon}>
                <Popup style={{ color: 'var(--text)' }}>
                  <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>🛰️ CyberCab #1</div>
                  <div style={{ fontSize: 11 }}>Speed: {location.speed.toFixed(1)} km/h</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Lat: {location.lat.toFixed(5)}</div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--panel-light)' }}>
              <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
                <Compass size={32} style={{ animation: 'spin 3s linear infinite', marginBottom: 12 }} />
                <div>Awaiting GPS connection...</div>
              </div>
            </div>
          )}

          {/* Floating Address Bar */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10, background: 'var(--panel-light)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', maxWidth: 'calc(100% - 32px)' }}>
            <div style={{ background: 'rgba(59,130,246,0.12)', padding: 6, borderRadius: 8, display: 'flex' }}>
              <MapPin size={16} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estimated Address</div>
              <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
                {location ? getAddress(location.lat, location.lng) : 'Resolving Position...'}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── Row 2: Telemetry + Operators & Geofencing ────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18 }}>

        {/* Telemetry Panel */}
        <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Activity size={16} color="var(--accent)" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Live Telemetry Coordinates</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Latitude',   value: location ? location.lat.toFixed(6) : '—', color: 'var(--text)' },
              { label: 'Longitude',  value: location ? location.lng.toFixed(6) : '—', color: 'var(--text)' },
              { label: 'Altitude',   value: '912 m',                                  color: 'var(--text)' },
              { label: 'Speed',      value: location ? `${location.speed.toFixed(1)} km/h` : '—', color: 'var(--success)' },
              { label: 'Bearing',    value: '45.2° NE',                               c: 'var(--text)' },
              { label: 'Accuracy',   value: '± 2.4 meters',                           color: '#10b981' }
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Path tracker breadcrumbs count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', padding: '10px 14px', background: 'var(--panel-light)', borderRadius: 10, border: '1px solid var(--panel-border)', fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
              <Milestone size={14} />
              <span>Breadcrumb Path Tracker</span>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--accent)' }}>{trail.length} GPS Points</span>
          </div>
        </motion.section>

        {/* Operators & Geofencing Panel */}
        <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Operator Authentication (Firebase Auth) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Shield size={16} color="var(--accent)" />
              <span style={{ fontWeight: 800, fontSize: 13 }}>Operator Authorization (Firebase)</span>
            </div>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12 }}>
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <UserCheck size={18} />
                  </div>
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontWeight: 800, fontSize: 13 }}>{currentUser.name}</span>
                    <span style={{ padding: '1px 6px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: 8, fontWeight: 800 }}>ACTIVE</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{currentUser.email}</div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, padding: 12, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 12, color: '#f59e0b' }}>Guest Operator Mode</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Sign in on the login page via Google/Email to get official verification tags in tracking logs.</div>
                </div>
              </div>
            )}
          </div>

          {/* Geofencing Config */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sliders size={16} color="var(--accent)" />
                <span style={{ fontWeight: 800, fontSize: 13 }}>Active Geofencing Guard</span>
              </div>
              <span style={{
                padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800,
                background: isBreached ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                color: isBreached ? '#ef4444' : '#10b981',
                border: `1px solid ${isBreached ? '#ef4444' : '#10b981'}44`
              }}>
                {isBreached ? '🚨 BREACHED' : '✅ SECURED'}
              </span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              
              {/* Distance Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--muted)' }}>Radial Distance:</span>
                <span style={{ fontWeight: 800, color: isBreached ? '#ef4444' : 'var(--text)' }}>
                  {distanceToCenter.toFixed(1)} m
                </span>
              </div>

              {/* Slider for radius adjustment */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 5 }}>
                  <span>Boundary Radius</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{geofenceRadius} meters</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={geofenceRadius}
                  onChange={e => setGeofenceRadius(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }}
                />
              </div>

              {/* Warning Alert if breached */}
              {isBreached && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
                  <AlertOctagon size={13} />
                  <span>Geofence Boundary Exceeded! Tracking active.</span>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
