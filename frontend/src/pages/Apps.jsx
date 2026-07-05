import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Globe, Download, CheckCircle2, Music, ShieldHalf, Zap, HeartPulse, Search, Eye, Wallet, Star, Play } from 'lucide-react';

const appCatalog = [
  { name: 'Spotify Drive', category: 'Music & Audio', desc: 'Immersive spatial audio optimized for exact cabin acoustics.', icon: Music, color: '#1DB954', rating: 4.9, playStoreUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music' },
  { name: 'SentryGuard AI', category: 'Security', desc: 'Real-time 360° AI anomaly detection & drone swarm dispatch.', icon: ShieldHalf, color: '#ef4444', rating: 4.8, playStoreUrl: 'https://play.google.com/store/search?q=dashcam+security+car&c=apps' },
  { name: 'ChargeMate Max', category: 'EV Utility', desc: 'Predictive thermal routing & peer-to-peer EV power sharing.', icon: Zap, color: '#f59e0b', rating: 4.7, playStoreUrl: 'https://play.google.com/store/search?q=EV+charging+stations&c=apps' },
  { name: 'CalmRide NLP', category: 'Wellness', desc: 'Biometric cabin adaptation using neural sentiment analysis.', icon: HeartPulse, color: '#8b5cf6', rating: 4.9, playStoreUrl: 'https://play.google.com/store/search?q=mindfulness+calm+health&c=apps' },
  { name: 'AR HUD Pro', category: 'Navigation', desc: 'Holographic V2X overlay of paths, hazards, and smart city signals.', icon: Eye, color: '#06b6d4', rating: 4.9, playStoreUrl: 'https://play.google.com/store/search?q=AR+navigation+HUD&c=apps' },
  { name: 'AutoPay Node', category: 'Finance', desc: 'Zero-click crypto infrastructure for tolls, drive-thrus, and charging.', icon: Wallet, color: '#10b981', rating: 4.6, playStoreUrl: 'https://play.google.com/store/search?q=crypto+wallet+payments&c=apps' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Apps() {
  const [installed, setInstalled] = useState(['Spotify Drive', 'AR HUD Pro']);
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
  const [inputValue, setInputValue] = useState('');
  const [playStoreQuery, setPlayStoreQuery] = useState('');

  const toggleInstall = (appName) => {
    setInstalled((prev) =>
      prev.includes(appName)
        ? prev.filter((name) => name !== appName)
        : [...prev, appName]
    );
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    let finalUrl = inputValue.trim();
    if (!finalUrl) return;

    if (/^https?:\/\//i.test(finalUrl)) {
      setUrl(finalUrl);
    } 
    else if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
      setUrl('https://' + finalUrl);
    } 
    else {
      setUrl(`https://www.google.com/search?q=${encodeURIComponent(finalUrl)}&igu=1`);
    }
  };

  const handlePlayStoreSearch = (e) => {
    e.preventDefault();
    if (!playStoreQuery.trim()) return;
    window.open(`https://play.google.com/store/search?q=${encodeURIComponent(playStoreQuery.trim())}&c=apps`, '_blank');
  };

  return (
    <motion.div 
      className="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="panel" variants={itemVariants}>
        <h2><Search size={24} color="#34d399" /> Discover on Google Play</h2>
        <form onSubmit={handlePlayStoreSearch} className="actions" style={{marginBottom: 0}}>
          <div style={{display: 'flex', flex: 1, position: 'relative', alignItems: 'center'}}>
            <Search size={18} color="var(--muted)" style={{position: 'absolute', left: 16}} />
            <input
              className="url-input"
              value={playStoreQuery}
              onChange={(e) => setPlayStoreQuery(e.target.value)}
              placeholder="Search for any app, game, or utility directly on Google Play..."
              style={{paddingLeft: 44, borderColor: 'rgba(52, 211, 153, 0.4)'}}
            />
          </div>
          <button type="submit" className="primary" style={{padding: '0 24px', background: '#01875F', border: 'none'}}>
            Search Play Store
          </button>
        </form>
      </motion.section>

      <motion.section className="panel" variants={itemVariants}>
        <h2><Grid size={24} color="var(--accent)" /> Next-Gen App Ecosystem</h2>
        <div className="card-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
          {appCatalog.map((app) => {
            const isInstalled = installed.includes(app.name);
            return (
              <motion.div 
                className="card" 
                key={app.name} 
                style={{display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden'}}
                whileHover={{ y: -5, boxShadow: `0 10px 40px ${app.color}20` }}
              >
                <div style={{position: 'absolute', top: -50, right: -50, width: 100, height: 100, background: app.color, filter: 'blur(60px)', opacity: 0.3}} />
                <div style={{display: 'flex', alignItems: 'flex-start', gap: 16, zIndex: 1}}>
                  <div style={{width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${app.color} 0%, rgba(0,0,0,0.4) 150%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${app.color}40`, flexShrink: 0}}>
                    <app.icon size={28} color="#fff" />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{fontWeight: 600, fontSize: 16}}>{app.name}</div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 2, color: 'var(--warning)', fontSize: 13, fontWeight: 700}}>
                        {app.rating} <Star size={12} fill="currentColor" />
                      </div>
                    </div>
                    <div style={{color: app.color, fontSize: 12, marginTop: 4, fontWeight: 500, letterSpacing: 0.5}}>{app.category.toUpperCase()}</div>
                  </div>
                </div>
                
                <div style={{fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, flex: 1, zIndex: 1}}>
                  {app.desc}
                </div>

                <div style={{display: 'flex', gap: 12, zIndex: 1}}>
                  {isInstalled ? (
                    <>
                      <button className="primary" style={{flex: 1, justifyContent: 'center', background: 'var(--panel-light)', color: 'var(--text)', border: '1px solid var(--panel-border)'}}>
                        <Play size={16} fill="currentColor" /> Launch
                      </button>
                      <button className="secondary" onClick={() => toggleInstall(app.name)} style={{padding: '0 16px', color: 'var(--danger)', borderColor: 'var(--danger-bg)'}}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <button
                      className="primary"
                      onClick={() => {
                        if(app.playStoreUrl) window.open(app.playStoreUrl, '_blank');
                        toggleInstall(app.name);
                      }}
                      style={{flex: 1, justifyContent: 'center', background: `linear-gradient(90deg, ${app.color}, #000)`, border: 'none'}}
                    >
                      <Download size={18} /> Get on Play Store
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.section className="panel" variants={itemVariants}>
        <h2><Globe size={24} color="var(--accent-2)" /> Web Browser</h2>
        <form onSubmit={handleNavigate} className="actions" style={{marginBottom: 20}}>
          <div style={{display: 'flex', flex: 1, position: 'relative', alignItems: 'center'}}>
            <Search size={18} color="var(--muted)" style={{position: 'absolute', left: 16}} />
            <input
              className="url-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search or enter web address"
              style={{paddingLeft: 44}}
            />
          </div>
          <button type="submit" className="primary" style={{padding: '0 24px'}}>Go</button>
        </form>
        <iframe 
          className="browser" 
          src={url} 
          title="Browser" 
          style={{background: '#fff', borderRadius: 16, border: 'none', width: '100%', height: 480}} 
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </motion.section>
    </motion.div>
  );
}
