import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileVideo, Music3, Radio, Search, Volume2, Maximize, Play, Pause, 
  Tv, Compass, FastForward, Rewind, Layers, Sliders, Settings, 
  Wifi, ShieldAlert, Heart, Info, RefreshCw, Upload, Check
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const popularPlaylists = [
  { name: 'Synthwave Highway', uri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLTE7yJ7nKG?utm_source=generator&theme=0', desc: 'Futuristic retrowave soundscapes.' },
  { name: 'Chill Lofi Beats', uri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8UebwvlZ86P?utm_source=generator&theme=0', desc: 'Relaxing ambient beats for slow cruising.' },
  { name: 'Electro Cabin', uri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0', desc: 'High energy bass drives.' }
];

const radioStations = [
  { freq: '98.5', name: 'Metro Ride FM', genre: 'Synth & Indie', signal: 94 },
  { freq: '101.1', name: 'Jazz Cafe Cab', genre: 'Classic Jazz', signal: 88 },
  { freq: '104.3', name: 'Pulse Dance', genre: 'House & Electro', signal: 91 },
  { freq: '90.7', name: 'VMS Highway Info', genre: 'Traffic & Talk', signal: 99 }
];

const movieCatalog = [
  {
    title: 'Sintel Trailer (W3C)',
    url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    duration: '0:52',
    desc: 'Epic fantasy animation trailer by Blender Foundation.'
  },
  {
    title: 'Oceans HD (ZenCDN)',
    url: 'https://vjs.zencdn.net/v/oceans.mp4',
    thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    duration: '0:46',
    desc: 'Breathtaking high-definition marine life capture.'
  },
  {
    title: 'Big Buck Bunny (W3Schools)',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumb: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
    duration: '0:10',
    desc: 'Standard high-compatibility open-source test stream.'
  }
];

export default function Media() {
  const [localMedia, setLocalMedia] = useState(null);
  const [spotifyUrl, setSpotifyUrl] = useState(popularPlaylists[0].uri);
  const [searchInput, setSearchInput] = useState('');
  
  // Equalizer & Audio State
  const [eqPreset, setEqPreset] = useState('Bass Boost');
  const [eqBands, setEqBands] = useState({ hz60: 8, hz230: 5, hz910: 1, khz4: 3, khz14: 6 });
  const [fader, setFader] = useState({ x: 0, y: 0 }); // Drag coords
  const [soundstage, setSoundstage] = useState('Driver Focus');

  // Radio Tuner State
  const [radioFreq, setRadioFreq] = useState(98.5);
  const [scanning, setScanning] = useState(false);
  const [activeStation, setActiveStation] = useState(radioStations[0]);

  // Video Theater State
  const [activeVideo, setActiveVideo] = useState(movieCatalog[0]);
  const videoRef = useRef(null);

  const { pushNotification } = useNotifications();

  // Handle Preset Changes
  const applyEqPreset = (preset) => {
    setEqPreset(preset);
    if (preset === 'Bass Boost') {
      setEqBands({ hz60: 9, hz230: 6, hz910: 1, khz4: 2, khz14: 3 });
    } else if (preset === 'Vocal Focus') {
      setEqBands({ hz60: 1, hz230: 3, hz910: 8, khz4: 6, khz14: 4 });
    } else if (preset === 'Electronic') {
      setEqBands({ hz60: 8, hz230: 4, hz910: 2, khz4: 7, khz14: 8 });
    } else if (preset === 'Flat') {
      setEqBands({ hz60: 0, hz230: 0, hz910: 0, khz4: 0, khz14: 0 });
    }
    pushNotification(`Audio EQ profile updated to ${preset}.`, 'success');
  };

  const handleSpotifySearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    if (query.includes('spotify.com')) {
      let embedLink = query;
      if (!embedLink.includes('/embed/')) {
        embedLink = embedLink.replace('spotify.com/', 'spotify.com/embed/');
        embedLink = embedLink.split('?')[0] + '?utm_source=generator&theme=0';
      }
      setSpotifyUrl(embedLink);
      pushNotification('Custom Spotify link loaded!', 'success');
      setSearchInput('');
    } else {
      window.open(`https://open.spotify.com/search/${encodeURIComponent(query)}`, '_blank');
      pushNotification('Finding song on Spotify... Paste the track link below!', 'info');
    }
  };

  const handleFaderClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200 - 100;
    const y = ((e.clientY - rect.top) / rect.height) * 200 - 100;
    setFader({ x: Math.round(x), y: Math.round(y) });
  };

  // Tune Radio
  const tuneStation = (station) => {
    setActiveStation(station);
    setRadioFreq(parseFloat(station.freq));
    pushNotification(`Tuned to FM ${station.freq} MHz - ${station.name}`, 'success');
  };

  const handleScanRadio = () => {
    setScanning(true);
    pushNotification('Scanning FM spectrum for high signal broadcasts...', 'info');
    setTimeout(() => {
      setScanning(false);
      const randomFreq = (87.5 + Math.random() * 20).toFixed(1);
      setRadioFreq(parseFloat(randomFreq));
      setActiveStation({ freq: randomFreq, name: 'AutoScan Broadcast', genre: 'Discovered Station', signal: 85 });
      pushNotification(`Scan complete. Found station at FM ${randomFreq} MHz`, 'success');
    }, 2000);
  };

  return (
    <motion.div 
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Outfit', sans-serif" }}
    >
      
      {/* ─── Row 1: Spotify + Radio controls ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 20 }}>
        
        {/* Spotify Integration */}
        <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Music3 size={20} color="#1DB954" /> Spotify Integration
            </h2>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>v2.4 Core Integration</span>
          </div>

          <form onSubmit={handleSpotifySearch} style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', flex: 1, position: 'relative', alignItems: 'center' }}>
              <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: 12 }} />
              <input
                className="url-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Paste Spotify Link or Search..."
                style={{ paddingLeft: 36, borderColor: 'rgba(29, 185, 84, 0.3)', width: '100%', background: 'rgba(0,0,0,0.3)', height: 36, color: '#fff', borderRadius: 8, fontSize: 12 }}
              />
            </div>
            <button type="submit" style={{ padding: '0 16px', background: '#1DB954', border: 'none', color: '#000', fontWeight: 700, borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
              Search/Play
            </button>
          </form>

          {/* Quick Playlists Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>QUICK START VEHICLE PLAYLISTS</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {popularPlaylists.map(pl => (
                <button
                  key={pl.name}
                  onClick={() => { setSpotifyUrl(pl.uri); pushNotification(`Loaded ${pl.name} playlist.`, 'success'); }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    fontSize: 11,
                    background: spotifyUrl === pl.uri ? 'rgba(29, 185, 84, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${spotifyUrl === pl.uri ? '#1DB954' : 'rgba(255,255,255,0.05)'}`,
                    color: spotifyUrl === pl.uri ? '#1DB954' : 'var(--text)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{pl.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2, fontWeight: 500 }}>{pl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* IFrame player container */}
          <div style={{ background: '#000', borderRadius: 12, overflow: 'hidden', height: 350, border: '1px solid var(--panel-border)', position: 'relative' }}>
            <iframe 
              title="Spotify Web Player"
              src={spotifyUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            />
          </div>
        </motion.section>

        {/* FM Radio Tuner & Soundstage Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Radio Tuner Panel */}
          <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Radio size={20} color="var(--accent)" /> Digital FM Tuner
              </h2>
              <button 
                onClick={handleScanRadio} 
                disabled={scanning}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: 11, fontWeight: 700, cursor: scanning ? 'not-allowed' : 'pointer'
                }}
              >
                <RefreshCw size={12} style={{ animation: scanning ? 'spin 1s linear infinite' : 'none' }} /> Scan FM
              </button>
            </div>

            {/* Display radio frequency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>TUNED STATION BROADCAST</span>
                <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  {radioFreq.toFixed(1)} <span style={{ fontSize: 14, color: 'var(--muted)' }}>MHz</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, marginTop: 2 }}>{activeStation.name}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>GENRE: {activeStation.genre.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>SIGNAL STRENGTH: {activeStation.signal}%</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ height: '100%', background: 'var(--accent)', width: `${activeStation.signal}%` }} />
                </div>
              </div>
            </div>

            {/* Fine tuner slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
                <span>87.5 MHz</span>
                <span>FM Dial</span>
                <span>108.0 MHz</span>
              </div>
              <input
                type="range"
                min="87.5"
                max="108.0"
                step="0.1"
                value={radioFreq}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setRadioFreq(val);
                  const matched = radioStations.find(st => parseFloat(st.freq) === val);
                  if (matched) tuneStation(matched);
                  else setActiveStation({ freq: val.toFixed(1), name: 'Unresolved Static', genre: 'Frequency Dial', signal: 30 });
                }}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            {/* Quick Stations presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>TUNED PRESETS</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {radioStations.map(station => (
                  <button
                    key={station.freq}
                    onClick={() => tuneStation(station)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 8,
                      fontSize: 11,
                      background: radioFreq === parseFloat(station.freq) ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${radioFreq === parseFloat(station.freq) ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
                      color: radioFreq === parseFloat(station.freq) ? 'var(--accent)' : 'var(--text)',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    <div>{station.freq}</div>
                    <div style={{ fontSize: 8, color: 'var(--muted)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{station.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Soundstage & Equalizer panel */}
          <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontSize: 16 }}>
              <Sliders size={20} color="var(--success)" /> Acoustic Equalizer & Soundstage
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
              {/* Left Column: EQ Band Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 4, justify: 'space-between' }}>
                  {['Bass Boost', 'Vocal Focus', 'Electronic', 'Flat'].map(preset => (
                    <button
                      key={preset}
                      onClick={() => applyEqPreset(preset)}
                      style={{
                        flex: 1,
                        padding: '4px',
                        borderRadius: 6,
                        fontSize: 9,
                        fontWeight: 700,
                        background: eqPreset === preset ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${eqPreset === preset ? 'var(--success)' : 'rgba(255,255,255,0.05)'}`,
                        color: eqPreset === preset ? 'var(--success)' : 'var(--text)',
                        cursor: 'pointer'
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* The 5 band sliders vertical mock representation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', height: 90, padding: '0 8px', alignItems: 'center' }}>
                  {Object.entries(eqBands).map(([band, val]) => (
                    <div key={band} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', gap: 4 }}>
                      <div style={{ height: 60, width: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, position: 'relative' }}>
                        <div style={{
                          position: 'absolute', bottom: `${((val + 10) / 20) * 100}%`, left: -3,
                          width: 10, height: 10, borderRadius: '50%', background: 'var(--success)',
                          boxShadow: '0 0 8px var(--success)'
                        }} />
                      </div>
                      <span style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'monospace' }}>
                        {band.replace('hz', '').replace('khz', 'k')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Speaker Fader control */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>SOUNDSTAGE BALANCE FADER</span>
                
                {/* Visual grid */}
                <div 
                  onClick={handleFaderClick}
                  style={{
                    width: 100, height: 100,
                    background: 'rgba(0,0,0,0.3)',
                    border: '1.5px solid var(--panel-border)',
                    borderRadius: 12,
                    position: 'relative',
                    cursor: 'crosshair',
                    overflow: 'hidden'
                  }}
                >
                  {/* Grid cross lines */}
                  <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.06)' }} />
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  
                  {/* Speaker labels */}
                  <div style={{ position: 'absolute', top: 4, left: 6, fontSize: 8, color: 'var(--muted)' }}>FL</div>
                  <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 8, color: 'var(--muted)' }}>FR</div>
                  <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 8, color: 'var(--muted)' }}>RL</div>
                  <div style={{ position: 'absolute', bottom: 4, right: 6, fontSize: 8, color: 'var(--muted)' }}>RR</div>

                  {/* Target point indicator */}
                  <motion.div
                    animate={{ x: (fader.x + 100) * 0.5 - 5, y: (fader.y + 100) * 0.5 - 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      position: 'absolute', top: 0, left: 0,
                      width: 10, height: 10, borderRadius: '50%', background: 'var(--success)',
                      boxShadow: '0 0 10px var(--success)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
                
                <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', gap: 8 }}>
                  <span>X: {fader.x > 0 ? `Right +${fader.x}` : fader.x < 0 ? `Left ${fader.x}` : 'Center'}</span>
                  <span>Y: {fader.y > 0 ? `Rear +${fader.y}` : fader.y < 0 ? `Front ${fader.y}` : 'Center'}</span>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* ─── Row 2: Cinema Drive Theater ─── */}
      <motion.section className="panel" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Tv size={20} color="var(--warning)" /> Onboard Drive Theater
          </h2>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Cinema Display v2.0 HD Link</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Main Video Display Screen */}
          <div style={{ background: '#000', borderRadius: 16, border: '1.5px solid var(--panel-border)', height: 380 }}>
            {localMedia ? (
              <video
                ref={videoRef}
                controls
                src={localMedia}
                style={{ width: '100%', height: '100%', borderRadius: 14, display: 'block', background: '#000' }}
              />
            ) : activeVideo ? (
              <video
                key={activeVideo.title}
                ref={videoRef}
                controls
                src={activeVideo.url}
                poster={activeVideo.thumb}
                style={{ width: '100%', height: '100%', borderRadius: 14, display: 'block', background: '#000' }}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                <FileVideo size={48} />
                <span style={{ marginTop: 10 }}>Select a movie to begin theatre display</span>
              </div>
            )}
          </div>

          {/* Catalog & Custom URL Sideloading list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>THEATER CATALOG</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 240 }}>
              {movieCatalog.map(movie => (
                <div
                  key={movie.title}
                  onClick={() => { setLocalMedia(null); setActiveVideo(movie); pushNotification(`Loading ${movie.title} to Theater display.`, 'success'); }}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: 8,
                    borderRadius: 10,
                    background: (activeVideo?.title === movie.title && !localMedia) ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${(activeVideo?.title === movie.title && !localMedia) ? 'var(--warning)' : 'rgba(255, 255, 255, 0.05)'}`,
                    cursor: 'pointer',
                    alignItems: 'center',
                    transition: 'background 0.2s'
                  }}
                >
                  <img src={movie.thumb} alt={movie.title} style={{ width: 64, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{movie.desc}</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4 }}>{movie.duration}</span>
                </div>
              ))}
            </div>

            {/* Custom movie loader */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>LOCAL DISK SIDELOAD</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--panel-border)', borderRadius: 10, padding: '10px 14px' }}>
                <Upload size={18} color="var(--muted)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>Browse Media File</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)' }}>Supports mp4, mp3, wav, webm</div>
                </div>
                <input 
                  type="file" 
                  accept="audio/*,video/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setLocalMedia(URL.createObjectURL(file));
                      pushNotification(`Loaded local file: ${file.name}`, 'success');
                    }
                  }} 
                  style={{
                    position: 'absolute', opacity: 0, width: 120, height: 36, cursor: 'pointer', zIndex: 1
                  }} 
                />
                <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', pointerEvents: 'none' }}>
                  Choose
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
