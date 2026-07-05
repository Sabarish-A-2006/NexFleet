import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileVideo, Music3, Radio, Search } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Media() {
  const [localMedia, setLocalMedia] = useState(null);
  const [spotifyUrl, setSpotifyUrl] = useState('https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0');
  const [searchInput, setSearchInput] = useState('');
  const { pushNotification } = useNotifications();

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
      pushNotification('Spotify Media Loaded! Hit play.', 'success');
      setSearchInput('');
    } else {
      window.open(`https://open.spotify.com/search/${encodeURIComponent(query)}`, '_blank');
      pushNotification('Opened Spotify. Find your song, copy the link, and paste it here!', 'info');
    }
  };

  return (
    <motion.div 
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{display: 'grid', gridTemplateColumns: 'minmax(350px, 1.2fr) 1fr', gap: 24}}>
        
        {/* Spotify Integration Panel */}
        <motion.section className="panel" variants={itemVariants} style={{display: 'flex', flexDirection: 'column'}}>
          <h2><Music3 size={24} color="var(--accent)" /> Spotify Player</h2>

          <form onSubmit={handleSpotifySearch} className="actions" style={{marginBottom: 0, marginTop: 16}}>
            <div style={{display: 'flex', flex: 1, position: 'relative', alignItems: 'center'}}>
              <Search size={18} color="var(--muted)" style={{position: 'absolute', left: 16}} />
              <input
                className="url-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search song, or paste a Spotify Link..."
                style={{paddingLeft: 44, borderColor: 'rgba(29, 185, 84, 0.4)'}}
              />
            </div>
            <button type="submit" className="primary" style={{padding: '0 20px', background: '#1DB954', border: 'none', color: '#000', fontWeight: 600}}>
              Play
            </button>
          </form>

          <div style={{flex: 1, marginTop: 16, background: 'var(--panel-light)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column'}}>
            
            <div style={{padding: '16px 20px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', gap: 12}}>
              <Radio size={20} color="#1DB954" />
              <span style={{fontSize: 14, fontWeight: 600, color: '#1DB954'}}>Direct Access Connected</span>
            </div>

            <iframe 
              title="Spotify Web Player"
              src={spotifyUrl} 
              width="100%" 
              height="100%" 
              style={{ minHeight: '450px', border: 'none', flex: 1 }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        </motion.section>

        {/* Cinema Display Panel */}
        <motion.section className="panel" variants={itemVariants} style={{display: 'flex', flexDirection: 'column'}}>
          <h2><FileVideo size={24} color="var(--warning)" /> Cinema Display</h2>
          {localMedia ? (
            <video className="media" controls src={localMedia} style={{width: '100%', borderRadius: 12, marginTop: 16, background: '#000'}} />
          ) : (
            <div className="browser" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--panel-light)', border: '2px dashed var(--panel-border)', height: '100%', minHeight: 350, marginTop: 16, borderRadius: 12}}>
              <FileVideo size={48} color="var(--muted)" style={{marginBottom: 16}} />
              <div style={{color: 'var(--muted)', textAlign: 'center', padding: '0 24px'}}>
                Select a media file or use the integrated Drive Theater
              </div>
              <input type="file" accept="audio/*,video/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) setLocalMedia(URL.createObjectURL(file));
              }} style={{marginTop: 20}} />
            </div>
          )}
        </motion.section>

      </div>
    </motion.div>
  );
}
