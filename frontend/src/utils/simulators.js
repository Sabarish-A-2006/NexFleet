export function getRandomStats() {
  return {
    tyrePressureFL: 32 + Math.random() * 3,
    tyrePressureFR: 32 + Math.random() * 3,
    tyrePressureRL: 32 + Math.random() * 3,
    tyrePressureRR: 32 + Math.random() * 3,
    fuelLevel: 40 + Math.random() * 50,
    mileageKm: 12000 + Math.random() * 5000,
    cabinTemperature: 20 + Math.random() * 8,
    seatCondition: ['Good', 'Comfort', 'Firm'][Math.floor(Math.random() * 3)],
    cleanliness: ['Clean', 'Moderate', 'Needs Wash'][Math.floor(Math.random() * 3)],
    serviceDueKm: 15000,
    serviceDueDate: '2026-06-30'
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getNextStats(prev) {
  const mileageDelta = 2 + Math.random() * 6;
  const fuelDelta = -0.6 - Math.random() * 0.8;

  return {
    ...prev,
    tyrePressureFL: clamp(prev.tyrePressureFL + (Math.random() - 0.5) * 0.4, 30, 36),
    tyrePressureFR: clamp(prev.tyrePressureFR + (Math.random() - 0.5) * 0.4, 30, 36),
    tyrePressureRL: clamp(prev.tyrePressureRL + (Math.random() - 0.5) * 0.4, 30, 36),
    tyrePressureRR: clamp(prev.tyrePressureRR + (Math.random() - 0.5) * 0.4, 30, 36),
    fuelLevel: clamp(prev.fuelLevel + fuelDelta, 5, 100),
    mileageKm: clamp(prev.mileageKm + mileageDelta, prev.mileageKm, prev.serviceDueKm + 2000),
    cabinTemperature: clamp(prev.cabinTemperature + (Math.random() - 0.5) * 0.6, 18, 30)
  };
}
