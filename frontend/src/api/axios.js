import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'
  || (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8080/api'),
  timeout: 5000
});

function apiResponse(data, message = 'OK') {
  return { success: true, message, data };
}

if (useMockApi) {
  const mock = new MockAdapter(api, { delayResponse: 300 });

  // Stateful memory to allow dynamic incident history in local demo mode.
  const H = (hours) => new Date(Date.now() - hours * 3600000).toISOString();
  let alertStore = [
    // ── Active / Unresolved ──────────────────────────────────────────────────
    { id: 'INC-001', vehicleId: 1, stage: 'SEVERE_CRASH',     severity: 'High',   createdAt: H(0.4),   status: 'EMERGENCY_DISPATCHED', message: 'Severe frontal collision detected at 92G. Emergency services dispatched to LAT 12.9716, LNG 77.5946.' },
    { id: 'INC-002', vehicleId: 1, stage: 'WARNING',           severity: 'Medium', createdAt: H(1.2),   status: 'ACTIVE',               message: 'Sudden deceleration spike detected: 28G. Driver non-responsive to system ping. Monitoring continues.' },
    { id: 'INC-003', vehicleId: 1, stage: 'TRAFFIC_HAZARD',    severity: 'Low',    createdAt: H(2.5),   status: 'LOGGED',               message: 'V2X network broadcast: debris field detected on NH-48 near Bangalore. Speed restriction advisory issued.' },
    { id: 'INC-004', vehicleId: 1, stage: 'SMALL_CRASH',       severity: 'Medium', createdAt: H(3.1),   status: 'ACTIVE',               message: 'Side impact detected at 22G (right lateral). Vehicle parked — suspected parking lot collision. Awaiting driver response.' },

    // ── Resolved / Historical ────────────────────────────────────────────────
    { id: 'INC-005', vehicleId: 1, stage: 'FALSE_ALARM',       severity: 'Low',    createdAt: H(5),     status: 'DRIVER_OVERRIDE',      message: 'Driver manually cancelled crash alert at WARNING stage. Confirmed road bump, not a collision.' },
    { id: 'INC-006', vehicleId: 1, stage: 'DIAGNOSTIC_CHECK',  severity: 'Info',   createdAt: H(6.5),   status: 'CLEARED',              message: 'Scheduled pre-drive diagnostic: LIDAR ✓  GPS ✓  V2X ✓  Accelerometer ✓  All systems fully operational.' },
    { id: 'INC-007', vehicleId: 1, stage: 'SEVERE_CRASH',      severity: 'High',   createdAt: H(24),    status: 'RESOLVED',             message: 'Rear-end collision at 67G on ORR flyover. Emergency services responded. Vehicle towed. Case closed.' },
    { id: 'INC-008', vehicleId: 1, stage: 'WARNING',           severity: 'Medium', createdAt: H(28),    status: 'DRIVER_OVERRIDE',      message: 'Sharp braking event (18G). Driver confirmed safe stop at traffic signal. Logged and cleared.' },
    { id: 'INC-009', vehicleId: 1, stage: 'TRAFFIC_HAZARD',    severity: 'Low',    createdAt: H(30),    status: 'RESOLVED',             message: 'LIDAR detected pedestrian near vehicle at low speed. Automatic emergency brake engaged. Incident avoided.' },
    { id: 'INC-010', vehicleId: 1, stage: 'SMALL_CRASH',       severity: 'Medium', createdAt: H(48),    status: 'RESOLVED',             message: 'Minor fender bender at 15G while reversing. No injuries reported. Insurance notification sent.' },
    { id: 'INC-011', vehicleId: 1, stage: 'DIAGNOSTIC_CHECK',  severity: 'Info',   createdAt: H(50),    status: 'CLEARED',              message: 'Post-incident diagnostic triggered automatically. All sensor calibrations within acceptable parameters.' },
    { id: 'INC-012', vehicleId: 1, stage: 'FALSE_ALARM',       severity: 'Low',    createdAt: H(72),    status: 'DRIVER_OVERRIDE',      message: 'Pothole at 4.2G triggered WARNING stage. Driver overrode — confirmed road surface impact, not collision.' },
    { id: 'INC-013', vehicleId: 1, stage: 'SEVERE_CRASH',      severity: 'High',   createdAt: H(96),    status: 'RESOLVED',             message: 'T-bone collision at intersection — 58G lateral. Airbags deployed. Driver transported to hospital. Fully resolved.' },
    { id: 'INC-014', vehicleId: 1, stage: 'TRAFFIC_HAZARD',    severity: 'Low',    createdAt: H(120),   status: 'RESOLVED',             message: 'V2X alert: school zone speed violation warning. Speed automatically limited to 30 km/h for 2.1 km zone.' },
    { id: 'INC-015', vehicleId: 1, stage: 'WARNING',           severity: 'Medium', createdAt: H(144),   status: 'RESOLVED',             message: 'High-G cornering detected (1.8G lateral). Driver counselling note added to safety log.' },
    { id: 'INC-016', vehicleId: 1, stage: 'DIAGNOSTIC_CHECK',  severity: 'Info',   createdAt: H(168),   status: 'CLEARED',              message: 'Weekly scheduled diagnostic completed. Firmware v3.2.1 applied to crash detection module.' },
  ];
  let idCounter = 100;

  mock.onPost('/locations').reply(200, apiResponse(null, 'Location saved'));
  mock.onPost('/stats').reply(200, apiResponse(null, 'Stats saved'));

  mock.onPost('/alerts').reply((config) => {
    const data = JSON.parse(config.data);
    const severity = data.stage === 'SEVERE_CRASH' ? 'High' : (data.stage === 'FALSE_ALARM' ? 'Low' : 'Medium');

    const newAlert = {
      id: `EVT-${idCounter++}`,
      vehicleId: data.vehicleId,
      stage: data.stage || 'UNKNOWN',
      severity: severity,
      createdAt: new Date().toISOString(),
      status: data.status || 'LOGGED',
      message: data.message || 'Automated Incident Log'
    };

    alertStore = [newAlert, ...alertStore];
    return [200, apiResponse(newAlert, 'Alert created')];
  });

  mock.onGet('/alerts').reply(() => [200, apiResponse(alertStore, 'Alerts fetched')]);
  mock.onGet('/locations').reply(200, apiResponse([], 'Locations fetched'));
  mock.onAny().reply(200, apiResponse(null));
}

export default api;
