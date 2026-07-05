import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, PhoneCall } from 'lucide-react';

function playAlarm() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    audioContext.close();
  }, 1000);
}

export default function CrashAlertModal() {
  const { crashActive, crashStage, crashCountdown, cancelCrashAlert, location } = useApp();

  useEffect(() => {
    if (crashActive) {
      playAlarm();
      const interval = setInterval(playAlarm, 1000);
      return () => clearInterval(interval);
    }
  }, [crashActive]);

  if (!crashActive) return null;

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(239, 68, 68, 0.4)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{background: '#111827', border: '2px solid var(--danger)', borderRadius: 24, padding: 40, textAlign: 'center', maxWidth: 500, width: '100%', boxShadow: '0 20px 60px rgba(239, 68, 68, 0.5)'}}
      >
        <div style={{width: 80, height: 80, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', margin: '0 auto 24px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1s infinite'}}>
           <AlertTriangle size={48} color="var(--danger)" />
        </div>
        
        <h1 style={{color: 'var(--danger)', margin: '0 0 8px 0', fontSize: 32, letterSpacing: 1}}>CRASH DETECTED</h1>
        <p style={{color: '#f87171', fontSize: 18, margin: '0 0 24px 0', fontWeight: 600}}>SYSTEM STAGE: {(crashStage || '').replace('_', ' ')}</p>

        <div style={{background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 20, marginBottom: 32}}>
          <div style={{fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1}}>{crashCountdown}s</div>
          <div style={{color: '#9ca3af', marginTop: 8}}>until automated emergency dispatch</div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--danger)', marginTop: 16, fontSize: 14}}>
             <PhoneCall size={16} /> Contacting Police & Nearest Hospital
          </div>
          <div style={{color: 'var(--muted)', fontSize: 12, marginTop: 4}}>
             Fetching GPS Lock: {location?.lat?.toFixed(5) || '0.0000'}, {location?.lng?.toFixed(5) || '0.0000'}
          </div>
        </div>

        <button 
          onClick={cancelCrashAlert} 
          style={{background: 'var(--success)', border: 'none', padding: '20px 40px', borderRadius: 12, fontSize: 20, fontWeight: 700, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 12, transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'}}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ShieldCheck size={28} /> I'M SAFE - CANCEL ALERT
        </button>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />
    </div>
  );
}
