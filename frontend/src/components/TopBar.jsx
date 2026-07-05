import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Wifi, Bluetooth, MapPin, Moon, ShieldCheck, Clock, Activity, Sun, LogOut, UserCircle } from 'lucide-react';

export default function TopBar() {
  const {
    wifiConnected,
    bluetoothConnected,
    gpsEnabled,
    liveMode,
    currentUser,
    theme,
    setTheme,
    logout,
  } = useApp();
  const [time, setTime] = useState(new Date());
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="chip chip-button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark and light mode"
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <div className="chip"><ShieldCheck size={16} color="var(--success)" /> Drive Assist</div>
      </div>
      <div className="topbar-right">
        <div className={`signal ${liveMode ? 'on' : 'off'}`}><Activity size={16} /> {liveMode ? 'Live' : 'Paused'}</div>
        <div className={`signal ${wifiConnected ? 'on' : 'off'}`}><Wifi size={16} /> Wi-Fi</div>
        <div className={`signal ${bluetoothConnected ? 'on' : 'off'}`}><Bluetooth size={16} /> BT</div>
        <div className={`signal ${gpsEnabled ? 'on' : 'off'}`}><MapPin size={16} /> GPS</div>
        {currentUser && (
          <>
            <div className="chip">
              <UserCircle size={16} />
              {currentUser.name}
            </div>
            <button
              className="chip chip-button"
              type="button"
              onClick={async () => {
                setSigningOut(true);
                try {
                  await logout();
                } finally {
                  setSigningOut(false);
                }
              }}
              disabled={signingOut}
              aria-label="Sign out"
            >
              <LogOut size={16} />
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </>
        )}
        <div className="clock">
          <Clock size={18} className="mr-2 inline-block align-middle text-primary-light" />
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </header>
  );
}
