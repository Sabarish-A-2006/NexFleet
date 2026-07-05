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
  let alertStore = [
    { id: 'ACT-90', stage: 'DIAGNOSTIC_CHECK', severity: 'Info', createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'CLEARED', message: 'Pre-drive telemetry check completed.' },
    { id: 'ACT-91', stage: 'TRAFFIC_HAZARD', severity: 'Low', createdAt: new Date(Date.now() - 1800000).toISOString(), status: 'RESOLVED', message: 'V2X network detected debris on roadway. Navigation rerouted.' }
  ];
  let idCounter = 92;

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
