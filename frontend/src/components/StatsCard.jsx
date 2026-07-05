import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, unit, trend, icon: Icon }) {
  return (
    <motion.div 
      className="card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="card-header">
        <span className="card-title">{title}</span>
        {Icon && <Icon size={20} color="var(--accent)" />}
      </div>
      <div className="card-value">
        {value} <span>{unit}</span>
      </div>
      {trend && <div className="card-trend">{trend}</div>}
    </motion.div>
  );
}
