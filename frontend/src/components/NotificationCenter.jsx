import React from 'react';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function NotificationCenter() {
  const { notifications } = useNotifications();

  return (
    <div className="notification-center">
      {notifications.map((n) => (
        <div key={n.id} className={`toast ${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
