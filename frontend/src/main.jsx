import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { initializeFirebaseAnalytics } from './services/firebase.js';
import './styles/tailwind.css';
import 'leaflet/dist/leaflet.css';

initializeFirebaseAnalytics();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NotificationProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
